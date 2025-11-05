import type { ITask, ITestCase } from "../interfaces";

export const geminiService = {
    generateTestCases: async (issueKey: string, testType: string): Promise<ITestCase[]> => {
        const testTypeParam = testType === "api" ? 0 : 1;

        const endpoint = `/api/generate-test-cases?issueKey=${issueKey}&testType=${testTypeParam}`;
        const accessToken = localStorage.getItem('accessToken');

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

            const testCases: ITestCase[] = await response.json();
            return testCases;

        } catch (error) {
            console.error('Error al obtener los tokens del backend:', error);
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

    generateTasks: async (pdf: File): Promise<ITask[]> => {
        const endpoint = "/api/generate-tasks";
        const accessToken = localStorage.getItem('accessToken');
        console.log('Sending PDF file to backend for task generation:', pdf);
        console.log(accessToken)

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
                body: JSON.stringify({ pdf })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            const tasks: ITask[] = await response.json();
            console.log('Tasks received from backend:', tasks);
            return tasks;

        } catch (error) {
            console.error('Error al obtener los tokens del backend:', error);
            throw error;
        }
    },
}