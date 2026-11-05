import {userInstance} from "@/app/header/api"
import {Tasks} from "@/app/tasks/types";

export async function getTasks(): Promise<Tasks> {
    const instance = await userInstance()
    const response = await instance.get("/task")
    return response.data
}

export async function checkSubTg(): Promise<boolean> {
    const instance = await userInstance()
    const response = await instance.post("/task/telegram")
    return response.data
}

export async function checkSubOther(channel: "x" | "youtube" | "instagram"): Promise<boolean> {
    const instance = await userInstance()
    const response = await instance.post("/task/other", {channel: channel})
    return response.data
}