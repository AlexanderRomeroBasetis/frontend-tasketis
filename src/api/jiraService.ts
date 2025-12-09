import type { IJiraIssue, ITaskGroup, ITestCase } from "../interfaces";

export const jiraService = {
    getJiraIssue: async (issueKey: string, accessToken: string): Promise<IJiraIssue> => {
        const endpoint = `/api/task?issueKey=${encodeURIComponent(issueKey)}`;

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
    },

    postTestCases: async (issueKey: string, testCases: ITestCase[]): Promise<void> => {
        const endpoint = `/api/post-test-cases?issueKey=${issueKey}`;
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            throw new Error('No access token available');
        }
        console.log('Test cases to send:', testCases);
        if (testCases.length === 0) {
            throw new Error('No test cases to send');
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(testCases)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

        } catch (error) {
            console.error('Error al obtener los tokens del backend:', error);
            throw error;
        }
    },

    postTaskGroups: async (projectKey: string, taskGroups: ITaskGroup[]): Promise<void> => {
        const endpoint = `/api/post-tasks?projectKey=${projectKey}`;
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            throw new Error('No access token available');
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(taskGroups),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }
        } catch (error) {
            throw error;
        }
    }
};