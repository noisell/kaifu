import {lotteryInstance} from "@/app/tickets/api";
import {Win} from "@/app/wins/types";

export async function getAllWins(): Promise<Win[]> {
    const instance = await lotteryInstance()
    const response = await instance.get("/wins")
    return response.data
}