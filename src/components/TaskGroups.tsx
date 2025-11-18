import { useState } from "react";
import type { ITaskGroup } from "../interfaces";
import { jiraService } from "../api/jiraService";

interface TaskGroupProps {
    taskGroupsFetched: ITaskGroup[];
}

const TaskGroup: React.FC<TaskGroupProps> = ({ taskGroupsFetched }) => {

    const [taskGroups, setTaskGroups] = useState<ITaskGroup[]>(taskGroupsFetched);
    const [showAlertNoSelectedTasksGroups, setShowAlertNoSelectedTasksGroups] = useState<boolean>(false);

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
                        )
                    }
                    : taskGroup
            )
        );
    };

    const alertNoSelectedTasksGroups = () => {
        return (
            <div className="fade-in-out fixed bottom-4 right-4 p-4 text-sm rounded-lg bg-red-50 bg-gray-100 text-red-400" role="alert">
                <span className="font-medium">Selecciona al menos una epica.</span>
            </div>
        );
    };

    const handlePostTaskGroups = () => {
        const selectedGroups = taskGroups.filter(group => group.selected);

        if (selectedGroups.length === 0) {
            setShowAlertNoSelectedTasksGroups(true);
            setTimeout(() => setShowAlertNoSelectedTasksGroups(false), 5000);
            throw new Error('No hay casos de prueba seleccionados para enviar.');
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
    };

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Tareas Generadas:</h2>
            <div className="space-y-6">
                {taskGroups.map((taskGroup, groupIndex) => (
                    <div key={groupIndex} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold mb-4 text-blue-600">{taskGroup.title}</h3>
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
                                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                                        <span className={`px-2 py-1 text-xs rounded-full ${task.priority === "high" ? "bg-red-100 text-red-800" :
                                            task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-green-100 text-green-800"
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">{task.description}</p>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                            {task.environment}
                                        </span>
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
            {showAlertNoSelectedTasksGroups && alertNoSelectedTasksGroups()}
        </div>
    );
};

export default TaskGroup;
