import { useState } from "react";
import type { ITaskGroup } from "../interfaces";
import UploadFile from "../components/UploadFile";
import TaskGroup from "../components/TaskGroups";

const TaskGenerator: React.FC = () => {
    const [taskGroups, setTaskGroups] = useState<ITaskGroup[]>([]);
    const [aiModel, setAiModel] = useState<number | 1>(1);
    const handleFilesGenerated = (generatedTaskGroups: ITaskGroup[]) => {
        setTaskGroups(generatedTaskGroups);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-4">
                <select
                    name="ai-model"
                    id="ai-model-selector"
                    className="flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={aiModel}
                    onChange={(e) => setAiModel(Number(e.target.value))}
                >
                    <option value="" disabled>
                        Selecciona el modelo de lenguaje que quieres usar
                    </option>
                    <option value="1">GEMINI</option>
                    <option value="2">CHATGPT</option>
                </select>
            </div>
            <UploadFile
                onFilesGenerated={handleFilesGenerated}
                aiModel={aiModel}
            />

            {taskGroups.length > 0 && (
                <TaskGroup
                    taskGroupsFetched={taskGroups}
                />
            )}
        </div>
    );
}

export default TaskGenerator;