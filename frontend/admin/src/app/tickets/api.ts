import {axiosBaseInstance} from "@/app/api";
import {Ticket} from "@/app/tickets/types";

export const lotteryInstance = async () => {
    return await axiosBaseInstance(false, "/admin/lottery")
}

export async function getAllTickets(): Promise<Ticket[]> {
    const instance = await lotteryInstance()
    const response = await instance.get("/tickets")
    return response.data
}