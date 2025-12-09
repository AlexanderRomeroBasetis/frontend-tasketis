import { useState } from "react";
import { testCaseService } from "../api/testCaseService";
import type { ITaskGroup } from "../interfaces";
import UploadFile from "../components/UploadFile";
import TaskGroup from "../components/TaskGroups";

const TaskGenerator: React.FC = () => {
    const [taskGroups, setTaskGroups] = useState<ITaskGroup[]>([]);

    const handleFilesGenerated = (generatedTaskGroups: ITaskGroup[]) => {
        setTaskGroups(generatedTaskGroups);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <UploadFile 
                onFilesGenerated={handleFilesGenerated}
                testCaseService={testCaseService}
            />

            {taskGroups.length > 0 && (
                <TaskGroup taskGroupsFetched={taskGroups} />
            )}
        </div>
    );
}

export default TaskGenerator;