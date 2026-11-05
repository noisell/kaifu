import { axiosBaseInstance } from "@/app/api";
import {User} from "@/app/header/types";

export async function userInstance() {
    return await axiosBaseInstance(false, "/user")
}

async function waitError(func: (...args: any[]) => unknown, ...args: any[]) {
    return new Promise(resolve => setTimeout(resolve, 3000)).then(() => func(...args));
}

export async function getUserInfo(): Promise<User> {
    const instance = await userInstance();
    try {
        const result = await instance.get("");
        return result.data;
    }
    catch (error) {
        return await waitError(getUserInfo) as User
    }
}