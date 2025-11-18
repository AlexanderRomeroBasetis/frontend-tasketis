import type { ITaskGroup, ITestCase } from "../interfaces";

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

    generateTasks: async (pdf: File): Promise<ITaskGroup[]> => {
        const endpoint = "/api/generate-tasks";
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            throw new Error('No access token available');
        }

        try {
            const formData = new FormData();
            formData.append('pdf', pdf);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error del servidor: ${response.status}`);
            }

            const tasks: ITaskGroup[] = await response.json();
            return tasks;

        } catch (error) {
            throw error;
        }
    },
}