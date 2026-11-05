import axios from 'axios'
import { loginData } from "@/app/api/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL as string;

export const axiosBaseInstance = async (cookie: boolean = false, prefix: string = "", token: boolean = true, checked: boolean = true) => {
    const instance = axios.create({
        baseURL: baseURL + prefix,
        headers: {
            Authorization: token ? `Bearer ${localStorage.getItem('token')}` : "",
            'Content-Type': 'application/json',
        },
        withCredentials: cookie,
    })
    if (checked) {
        instance.interceptors.request.use(
            config => {
                if (localStorage.getItem('token')) {
                    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );
        instance.interceptors.response.use(
            response => response,
            async error => {
                const isNetworkError = !error.response;

                if (isNetworkError) {
                    // PopUp
                    return false
                } else if (error.response && error.response.status === 401) {
                    const refreshed = await refreshAccessToken();
                    if (refreshed) return instance(error.config);
                    else return window.location.replace("/")
                } else if (error.response && error.response.status === 403) {
                    // PopUp
                    return false
                } else if ([400, 404].includes(error.response.status)) {
                    return Promise.reject(error);
                } else {
                    // PopUp
                    return false
                }
            }
        );
    }
    return instance;
}

async function refreshAccessToken(): Promise<boolean> {
    const instance = await axiosBaseInstance(true, "/auth", true, false)
    try {
        const response = await instance.post(`${baseURL}/admin/refresh`, {user_id: localStorage.getItem('user_id')});
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        return true
    } catch (error: any) {
        return false
    }
}

export async function authentication(data?: loginData) {
    let instance = await axiosBaseInstance(true, "/auth", false)
    if (!data) {
        instance = await axiosBaseInstance(true, "/auth", false, false)
    }
    try {
        const response = await instance.post("/admin/login", data ? {
            login: data.login,
            password: data.password,
            remember_me: data.remember_me,
        } : null)
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', response.data.user_id)
        localStorage.setItem('level', response.data.level)
        return true
    } catch (error) { return false }
}