import {axiosBaseInstance} from "@/app/api";
import {System, SystemNames, SystemNames2} from "@/app/settings/types";

export const systemInstance = async () => {
    return await axiosBaseInstance(false, "/admin/system")
}

export async function getSettings(): Promise<System[]> {
    const instance = await systemInstance()
    const response = await instance.get("")
    return response.data
}

export async function changeSettings(name: SystemNames | SystemNames2, value: string): Promise<void> {
    const instance = await systemInstance()
    await instance.patch("", {name: name, value: value})
}

export async function getSystemValue(name: SystemNames): Promise<System> {
    const instance = await axiosBaseInstance(false, "/system")
    const response = await instance.get("/value", {params: {name: name}});
    return response.data;
}