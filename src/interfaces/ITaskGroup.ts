import type { ITask } from "./ITask";

export interface ITaskGroup {
    tasks: ITask[];
    title: string;
    selected?: boolean;
}