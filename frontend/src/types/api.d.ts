declare interface Api {
    getRequest: {
        path: RequestInfo | string,
        options?: RequestInit| undefined
    }
}