export interface IJiraIssue {
    title: string;
    description?: string | null;
    assignee: string;
    type: string;
    status: string;
}