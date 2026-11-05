import {axiosBaseInstance} from "@/app/api";
import {Transaction} from "@/app/transactions/types";

export const trInstance = async () => {
    return await axiosBaseInstance(false, "/admin/money")
}

export async function getAllHistoryMoney(): Promise<Transaction[]> {
    const instance = await trInstance()
    const response = await instance.get("")
    return response.data
}

export async function changeHistoryMoney(id: number, system_wallet: string) {
    const instance = await trInstance()
    await instance.patch("", {id: id, system_wallet: system_wallet})
}