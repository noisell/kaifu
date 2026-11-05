import {axiosBaseInstance} from "@/app/api/index";
import {systemData, systemNames} from "@/app/api/types";

async function systemInstance() {
    return await axiosBaseInstance(false, "/system", false)
}

export async function getSystemData(): Promise<systemData[]> {
    const instance = await systemInstance();
    const response = await instance.get("/data")
    return response.data;
}

export async function getSystemValue(name: systemNames): Promise<systemData> {
    const instance = await systemInstance();
    const response = await instance.get("/value", {params: {name: name}});
    return response.data;
}