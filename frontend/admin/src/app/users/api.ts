import {axiosBaseInstance} from "@/app/api";
import {User} from "@/app/api/types";

export const userInstance = async () => {
    return await axiosBaseInstance(false, "/admin/user")
}

export async function getAllUsers(): Promise<User[]> {
    const instance = await userInstance()
    const response = await instance.get("")
    return response.data
}

export async function changeUser(id: number, gold: number, silver: number, banned: boolean) {
    const instance = await userInstance()
    await instance.patch("", {id: id, gold_coins: gold, silver_coins: silver, banned: banned})
}