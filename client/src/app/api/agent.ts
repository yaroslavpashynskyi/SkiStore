import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

const responeBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.interceptors.response.use(
    async response => {
        await sleep();
        return response;
    },
    (error: AxiosError) => {
        const { data, status } = error.response as AxiosResponse;
        switch (status) {
            case 400:
                if (data.errors) {
                    const modelStateError: string[] = [];
                    for (const key in data.errors) {
                        modelStateError.push(data.errors[key]);
                    }

                    throw modelStateError.flat();
                }
                toast.error(data.title);
                break;
            case 401:
                toast.error(data.title);
                break;
            case 500:
                router.navigate("/server-error", { state: { error: data } });
                break;
            default:
                break;
        }

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

const Basket = {
    get: () => requests.get("basket"),
    addItem: (productId: number, quantity = 1) =>
        requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) =>
        requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}
const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent;