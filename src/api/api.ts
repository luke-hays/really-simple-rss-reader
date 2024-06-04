export const getRequest = async ({url, options} : Api['getRequest']) => {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        throw error;
    }
}