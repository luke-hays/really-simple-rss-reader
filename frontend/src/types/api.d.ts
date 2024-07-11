declare interface Api {
    getRequest: {
        url: RequestInfo | string,
        options?: RequestInit| undefined
    }
}