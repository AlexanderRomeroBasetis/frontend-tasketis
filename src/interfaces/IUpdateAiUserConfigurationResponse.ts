export interface IUpdateAiUserConfigurationResponse {
  type: 'GEMINI' | 'CHATGPT';
  user: {
    name: string;
    email: string;
    googleId: string;
    profilePictureUrl: string;
    jiraToken: string;
    jiraUrl: string;
    jiraVersion: 'SERVER' | 'CLOUD';
    iaUserConfigurations: string[];
    id: number;
    creationDate: string;
    updateDate: string;
    enabled: boolean;
    deleted: boolean;
  };
  token: string;
  id: number;
  creationDate: string;
  updateDate: string;
  enabled: boolean;
  deleted: boolean;
}