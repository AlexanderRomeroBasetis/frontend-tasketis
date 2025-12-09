import type { IAi } from "../interfaces";

export const aiService = {
    getAiType: async (): Promise<IAi[]> => {
        const endpoint = '/api/ia/select';
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

            const aiList: IAi[] = await response.json();
            return aiList;

        } catch (error) {
            console.error('Error al obtener los tokens del backend:', error);
            throw error;
        }
    },
};