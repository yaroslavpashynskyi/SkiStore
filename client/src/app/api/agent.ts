import axios, { AxiosError, AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5000/api/";

const responeBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.log("Caught by interceptor")
        return Promise.reject(error);
    }
)

const requests = {
    get: (url: string) => axios.get(url).then(responeBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responeBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responeBody),
    delete: (url: string) => axios.delete(url).then(responeBody),
}

const Catalog = {
    list: () => requests.get("products"),
    details: (id: number) => requests.get(`products/${id}`),
}

const TestErrors = {
    get400Error: () => requests.get("buggy/bad-request"),
    get401Error: () => requests.get("buggy/unauthorized"),
    get404Error: () => requests.get("buggy/not-found"),
    get500Error: () => requests.get("buggy/server-error"),
    getValidationError: () => requests.get("buggy/validation-error"),
}
const agent = {
    Catalog,
    TestErrors
}

export default agent;