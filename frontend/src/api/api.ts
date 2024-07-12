const BASE_PATH = 'http://localhost:3001'

export const getRequest = async ({path, options} : Api['getRequest']) => {
    try {
        const response = await fetch(`${BASE_PATH}/${path}`, options);
        return response;
    } catch (error) {
        throw error;
    }
}