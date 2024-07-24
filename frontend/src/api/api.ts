const BASE_PATH = 'http://localhost:3000'

export const getRequest = async ({path, options} : ApiRequest) => {
    try {
        const response = await fetch(`${BASE_PATH}/${path}`, options);
        return response;
    } catch (error) {
        throw error;
    }
}

export const postRequest = async ({path, options} : ApiRequest) => {
    if (options == null) throw new Error('Unable to make post request')

    options.method = 'POST'
    options.headers = {'Content-Type': 'application/json'}
    
    try {
        const response = await fetch(`${BASE_PATH}/${path}`, options);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteRequest = async ({path} : ApiRequest) => {
    const options = {method: 'DELETE'}
        
    try {
        const response = await fetch(`${BASE_PATH}/${path}`, options);
        return response;
    } catch (error) {
        throw error;
    }
}
