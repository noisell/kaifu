import {axiosBaseInstance} from "@/app/api";
import {Bank, BankType} from "@/app/bank/types";

export const bankInstance = async () => {
    return await axiosBaseInstance(false, "/admin/bank")
}

export async function getBank(): Promise<Bank> {
    const instance = await bankInstance()
    const response = await instance.get("")
    return response.data
}

export async function changeBank(type: BankType, value: number) {
    const instance = await bankInstance()
    await instance.patch("", {type: type, value: value})
}