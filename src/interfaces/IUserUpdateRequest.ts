export interface IUserUpdateRequest {
    geminiToken?: string;
    chatgptToken?: string;
    jiraToken: string;
    jiraUrl: string;
    jiraVersion: number;
}