import type { ITestCase } from "../interfaces";

export const testCaseService = {
    generateTestCases: async (issueKey: string, testType: string, aiType: number): Promise<ITestCase[]> => {
        const testTypeParam = testType === "api" ? 0 : 1;

        const endpoint = `/api/test?issueKey=${issueKey}&testType=${testTypeParam}&iaType=${aiType}`;
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
    }
}