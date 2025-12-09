import type { ITaskGroup } from "../interfaces";

export const taskService = {
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
    }
}