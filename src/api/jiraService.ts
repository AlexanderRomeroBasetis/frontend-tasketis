import type { IJiraIssue } from "../interfaces";

export const jiraService = {
    getJiraIssue: async (issueKey: string, accessToken: string): Promise<IJiraIssue> => {
        const endpoint = `/api/get-task?issueKey=${encodeURIComponent(issueKey)}`;

        if (!accessToken) {
            throw new Error('No access token available');
        }

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            const jiraIssue: IJiraIssue = await response.json();
            return jiraIssue;
        } catch (error) {
            throw error;
        }
    }
};