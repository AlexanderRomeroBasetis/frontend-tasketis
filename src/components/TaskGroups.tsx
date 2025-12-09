import { useState } from "react";
import type { ITaskGroup } from "../interfaces";
import { jiraService } from "../api/jiraService";

interface TaskGroupProps {
    taskGroupsFetched: ITaskGroup[];
}

const TaskGroup: React.FC<TaskGroupProps> = ({ taskGroupsFetched }) => {

    const [taskGroups, setTaskGroups] = useState<ITaskGroup[]>(taskGroupsFetched);
    const [showAlertWrongSelection, setShowAlertWrongSelection] = useState<boolean>(false);
    const [showAlertTasksSendCorrectly, setShowAlertTasksSendCorrectly] = useState<boolean>(false);
    const [showAlertNoToken, setShowAlertNoToken] = useState<boolean>(false);
    const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null);
    const [editingTaskField, setEditingTaskField] = useState<{
        groupIndex: number;
        taskIndex: number;
        field: 'title' | 'description' | 'priority' | 'environment';
    } | null>(null);

    const handleTitleClick = (index: number) => {
        setEditingTitleIndex(index);
    };

    const handleTitleChange = (index: number, newTitle: string) => {
        setTaskGroups(prevTaskGroups =>
            prevTaskGroups.map((taskGroup, i) =>
                i === index
                    ? { ...taskGroup, title: newTitle }
                    : taskGroup
            )
        );
    };

    const handleTitleBlur = () => {
        setEditingTitleIndex(null);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingTitleIndex(null);
        }
    };

    const handleTaskFieldClick = (groupIndex: number, taskIndex: number, field: 'title' | 'description' | 'priority' | 'environment') => {
        setEditingTaskField({ groupIndex, taskIndex, field });
    };

    const handleTaskFieldChange = (groupIndex: number, taskIndex: number, field: string, newValue: string) => {
        setTaskGroups(prevTaskGroups =>
            prevTaskGroups.map((taskGroup, gIndex) =>
                gIndex === groupIndex
                    ? {
                        ...taskGroup,
                        tasks: taskGroup.tasks.map((task, tIndex) =>
                            tIndex === taskIndex
                                ? { ...task, [field]: newValue }
                                : task
                        )
                    }
                    : taskGroup
            )
        );
    };

    const handleTaskFieldBlur = () => {
        setEditingTaskField(null);
    };

    const handleTaskFieldKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setEditingTaskField(null);
        }
    };

    const isTaskFieldEditing = (groupIndex: number, taskIndex: number, field: string) => {
        return editingTaskField?.groupIndex === groupIndex &&
            editingTaskField?.taskIndex === taskIndex &&
            editingTaskField?.field === field;
    };

    // Handle Selection
    const handleTaskGroupSelection = (index: number) => {
        setTaskGroups(prevTaskGroups =>
            prevTaskGroups.map((taskGroup, i) =>
                i === index
                    ? { ...taskGroup, selected: !taskGroup.selected }
                    : taskGroup
            )
        );
    };

    const handleTaskSelection = (groupIndex: number, taskIndex: number) => {
        setTaskGroups(prevTaskGroups =>
            prevTaskGroups.map((taskGroup, gIndex) =>
                gIndex === groupIndex
                    ? {
                        ...taskGroup,
                        tasks: taskGroup.tasks.map((task, tIndex) =>
                            tIndex === taskIndex
                                ? { ...task, selected: !task.selected }
                                : task
                        ),
                        selected: taskGroup.tasks.some((task, tIndex) =>
                            tIndex === taskIndex
                                ? !task.selected
                                : task.selected
                        )
                    }
                    : taskGroup
            )
        );
    };

    // Alert Components
    const alertWrongSelection = () => {
        return (
            <div className="fade-in-out fixed bottom-4 right-4 p-4 text-sm rounded-lg bg-red-50 bg-gray-100 text-gray-600" role="alert">
                <span className="font-medium">Selecciona al menos una epica.</span>
                <br />
                <span className="font-medium">Todas las epicas deben tener minimo una tarea.</span>
            </div>
        );
    };

    const alertTasksSendCorrectly = () => {
        return (
            <div className="fade-in-out fixed bottom-4 right-4 p-4 text-sm rounded-lg bg-green-50 bg-gray-100 text-gray-600" role="alert">
                <span className="font-medium">Tareas enviadas correctamente.</span>
            </div>
        );
    };

    const alertNoToken = () => {
        return (
            <div className="fade-in-out fixed bottom-4 right-4 p-4 text-sm rounded-lg bg-red-50 bg-gray-100 text-gray-600" role="alert">
                <span className="font-medium">No se pudo enviar las tareas. Token no válido.</span>
            </div>
        );
    };

    // Post Task Groups
    const handlePostTaskGroups = () => {
        if (localStorage.getItem('accessToken') === null) {
            setShowAlertNoToken(true);
            setTimeout(() => setShowAlertNoToken(false), 5000);
            throw new Error('No se pudo enviar las tareas. Token no válido.');
        }

        const selectedGroups = taskGroups.filter(group => group.selected);

        if (selectedGroups.length === 0) {
            setShowAlertWrongSelection(true);
            setTimeout(() => setShowAlertWrongSelection(false), 5000);
            throw new Error('No hay casos de prueba seleccionados para enviar.');
        }

        const groupsWithNoSelectedTasks = selectedGroups.filter(group => !group.tasks.some(task => task.selected));
        if (groupsWithNoSelectedTasks.length > 0) {
            setShowAlertWrongSelection(true);
            setTimeout(() => setShowAlertWrongSelection(false), 5000);
            throw new Error('No hay tareas seleccionadas para enviar en algunos grupos.');
        }

        const transformedGroups = selectedGroups.map(group => ({
            ...group,
            tasks: group.tasks
                .filter(task => task.selected)
                .map(task => ({
                    ...task,
                    description: task.description
                }))
        })).filter(group => group.tasks.length > 0);

        if (transformedGroups.length === 0) {
            throw new Error('No hay tareas seleccionadas para enviar.');
        }

        console.log('Grupos de tareas seleccionados para enviar:', transformedGroups);
        jiraService.postTaskGroups('PIA', transformedGroups);
        setShowAlertTasksSendCorrectly(true);
        setTimeout(() => setShowAlertTasksSendCorrectly(false), 5000);
    };

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Tareas Generadas:</h2>
            <div className="space-y-6">
                {taskGroups.map((taskGroup, groupIndex) => (
                    <div key={groupIndex} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center">
                                {editingTitleIndex === groupIndex ? (
                                    <input
                                        type="text"
                                        name={`task-group-title-${groupIndex}`}
                                        value={taskGroup.title}
                                        onChange={(e) => handleTitleChange(groupIndex, e.target.value)}
                                        onBlur={handleTitleBlur}
                                        onKeyDown={(e) => handleTitleKeyDown(e)}
                                        className="w-100 font-bold mb-4 text-blue-600 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <h3
                                        className="text-xl font-bold mb-4 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                                        onClick={() => handleTitleClick(groupIndex)}
                                    >
                                        {taskGroup.title}
                                    </h3>
                                )}
                            </div>
                            <input
                                id={`task-group-checkbox-${groupIndex}`}
                                name="test-checkbox"
                                type="checkbox"
                                checked={taskGroup.selected || false}
                                onChange={() => handleTaskGroupSelection(groupIndex)}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="space-y-3">
                            {taskGroup.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                                    <div className="flex justify-between items-start mb-2">
                                        {isTaskFieldEditing(groupIndex, taskIndex, 'title') ? (
                                            <input
                                                type="text"
                                                value={task.title}
                                                onChange={(e) => handleTaskFieldChange(groupIndex, taskIndex, 'title', e.target.value)}
                                                onBlur={handleTaskFieldBlur}
                                                onKeyDown={handleTaskFieldKeyDown}
                                                className="font-medium text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-gray-500 focus:outline-none flex-1 mr-2"
                                                autoFocus
                                            />
                                        ) : (
                                            <h4
                                                className="font-medium text-gray-900 cursor-pointer hover:text-gray-700 transition-colors flex-1"
                                                onClick={() => handleTaskFieldClick(groupIndex, taskIndex, 'title')}
                                            >
                                                {task.title}
                                            </h4>
                                        )}
                                        {isTaskFieldEditing(groupIndex, taskIndex, 'priority') ? (
                                            <select
                                                value={task.priority}
                                                onChange={(e) => handleTaskFieldChange(groupIndex, taskIndex, 'priority', e.target.value)}
                                                onBlur={handleTaskFieldBlur}
                                                onKeyDown={handleTaskFieldKeyDown}
                                                className="text-xs rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                autoFocus
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full cursor-pointer hover:opacity-75 transition-opacity ${task.priority === "high" ? "bg-red-100 text-red-800" :
                                                        task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-green-100 text-green-800"
                                                    }`}
                                                onClick={() => handleTaskFieldClick(groupIndex, taskIndex, 'priority')}
                                            >
                                                {task.priority}
                                            </span>
                                        )}
                                    </div>
                                    {isTaskFieldEditing(groupIndex, taskIndex, 'description') ? (
                                        <textarea
                                            value={task.description}
                                            onChange={(e) => handleTaskFieldChange(groupIndex, taskIndex, 'description', e.target.value)}
                                            onBlur={handleTaskFieldBlur}
                                            onKeyDown={handleTaskFieldKeyDown}
                                            className="w-full text-gray-600 mb-2 bg-transparent border border-gray-300 rounded p-2 focus:border-gray-500 focus:outline-none resize-none"
                                            rows={3}
                                            autoFocus
                                        />
                                    ) : (
                                        <p
                                            className="text-gray-600 mb-2 cursor-pointer hover:text-gray-500 transition-colors"
                                            onClick={() => handleTaskFieldClick(groupIndex, taskIndex, 'description')}
                                        >
                                            {task.description}
                                        </p>
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        {isTaskFieldEditing(groupIndex, taskIndex, 'environment') ? (
                                            <input
                                                type="text"
                                                value={task.environment}
                                                onChange={(e) => handleTaskFieldChange(groupIndex, taskIndex, 'environment', e.target.value)}
                                                onBlur={handleTaskFieldBlur}
                                                onKeyDown={handleTaskFieldKeyDown}
                                                className="inline-block px-2 py-1 text-xs bg-transparent border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                                                autoFocus
                                            />
                                        ) : (
                                            <span
                                                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                                                onClick={() => handleTaskFieldClick(groupIndex, taskIndex, 'environment')}
                                            >
                                                {task.environment}
                                            </span>
                                        )}
                                        <input
                                            id={`task-checkbox-${groupIndex}-${taskIndex}`}
                                            name="task-checkbox"
                                            type="checkbox"
                                            checked={task.selected || false}
                                            onChange={() => handleTaskSelection(groupIndex, taskIndex)}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-4">
                <button
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={handlePostTaskGroups}
                >
                    Enviar
                </button>
            </div>
            {showAlertWrongSelection && alertWrongSelection()}
            {showAlertTasksSendCorrectly && alertTasksSendCorrectly()}
            {showAlertNoToken && alertNoToken()}
        </div>
    );
};

export default TaskGroup;
