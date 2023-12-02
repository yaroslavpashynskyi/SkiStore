import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const responeBody = (response: AxiosResponse) => response.data;

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}
)

axios.interceptors.response.use(
    async response => {
        if (import.meta.env.DEV) await sleep();
        const pagination = response.headers["pagination"];
        if (pagination) {
            response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
            return response;
        }
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
    get: (url: string, params?: URLSearchParams) => axios.get(url, { params }).then(responeBody),
    post: (url: string, body: object) => axios.post(url, body).then(responeBody),
    put: (url: string, body: object) => axios.put(url, body).then(responeBody),
    delete: (url: string) => axios.delete(url).then(responeBody),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get("products", params),
    details: (id: number) => requests.get(`products/${id}`),
    filters: () => requests.get("products/filters")
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

const Account = {
    login: (values: any) => requests.post("account/login", values),
    register: (values: any) => requests.post("account/register", values),
    currentUser: () => requests.get("account/currentUser"),
    fetchAddress: () => requests.get("account/savedAddress")
}

const Orders = {
    list: () => requests.get("orders"),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post("orders", values)
}

const Payments = {
    createPaymentIntent: () => requests.post('payments', {})
}
const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Payments
}

export default agent;