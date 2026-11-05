import axios from 'axios'
import { loginData } from "@/app/api/types";
import {language} from "@/app/language";

const baseURL = process.env.NEXT_PUBLIC_API_URL as string;

export const axiosBaseInstance = async (cookie: boolean = false, prefix: string = "", token: boolean = true) => {
    const instance = axios.create({
        baseURL: baseURL + prefix,
        headers: {
            Authorization: token ? `Bearer ${localStorage.getItem('token')}` : "",
            'Content-Type': 'application/json',
        },
        withCredentials: cookie,
    })
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
            const isNetworkError = !error.response; // Проверка на ошибку сети (нет ответа от сервера)

            if (isNetworkError) {
                return Telegram.WebApp.showPopup({
                    title: language("Network Error"),
                    message: language("Please check your internet connection and try again"),
                    buttons: [{ id: 'closeWebApp', type: 'close' }],
                });
            } else if (error.response && error.response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) return instance(error.config);
                else return Telegram.WebApp.showPopup({
                    title: language("Session Expired"),
                    message: language("Please close or restart the application"),
                    buttons: [{ id: 'closeWebApp', type: 'close'}],
                });
            } else if (error.response && error.response.status === 403) {
                return Telegram.WebApp.showPopup({
                    title: 'Forbidden',
                    message: 'You do not have permission to access this resource.',
                    buttons: [{ id: 'ok', type: 'ok'}]
                });
            } else if ([400, 404].includes(error.response.status)) {
                return Promise.reject(error);
            } else {
                // Обработка остальных ошибок (можно вывести общее сообщение об ошибке)
                return Telegram.WebApp.showPopup({
                    title: language("Error"),
                    message: language("An unexpected error occurred. Please try again later"),
                    buttons: [{ id: 'ok', type: 'ok'}]
                });
            }
        }
    );
    return instance;
}

async function refreshAccessToken(): Promise<boolean> {
    const instance = await axiosBaseInstance(true)
    try {
        const response = await instance.post(`${baseURL}/auth/refresh`, {user_id: localStorage.getItem('user_id')});
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        return true
    } catch (error: any) {
        return false
    }
}

async function authentication(data: loginData) {
    const instance = await axiosBaseInstance(true)
    try {
        const response = await instance.post(`${baseURL}/auth/login`, {
            user_id: data.user_id,
            username: data.username,
            init_data: data.initData,
            avatar: data.avatar ? data.avatar : null,
        })
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        return true
    } catch (error) { return false }
}

async function createUser(data: loginData, referrerID: number | null) {
    const instance = await axiosBaseInstance(true)
    try {
        await instance.post(`${baseURL}/user`, {
            id: data.user_id,
            username: data.username ? data.username : null,
            referrer_id: referrerID,
            avatar: data.avatar ? data.avatar : null,
        })
        return true
    }
    catch (error) { return false }
}

export async function authorization(userData: loginData, referrer_id: number | null, newUser: boolean = false): Promise<{status: boolean, newUser: boolean}> {
    localStorage.setItem("user_id", `${userData.user_id}`)
    try {
        const authenticated = await authentication(userData)
        if (!authenticated) {
            const created = await createUser(userData, referrer_id)
            if (!created) {
                Telegram.WebApp.showPopup({
                    title: language("An error has occurred"),
                    message: language("Please close or restart the application"),
                    buttons: [{id: 'closeWebApp', type: 'close'}],
                })
                return {status: false, newUser: false}
            }
            return await authorization(userData, referrer_id, true)
        }
        return {status: true, newUser: newUser};
    }
    catch (error) { return {status: false, newUser: false} }
}