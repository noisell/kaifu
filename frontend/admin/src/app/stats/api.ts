import {axiosBaseInstance} from "@/app/api";
import {MoneyStats, TicketStats, UserStats} from "@/app/stats/types";

export const statsInstance = async () => {
    return await axiosBaseInstance(false, "/admin/stats")
}

export async function getMoneyStats(): Promise<MoneyStats> {
    const instance = await statsInstance();
    const response = await instance.get("/money")
    return response.data
}

export async function getUserStats(): Promise<UserStats> {
    const instance = await statsInstance();
    const response = await instance.get("/user")
    return response.data
}

export async function getTicketStats(active: boolean = false): Promise<TicketStats> {
    const instance = await statsInstance();
    if (active) {
        const response = await instance.get("/tickets/active")
        return response.data
    }
    else {
        const response = await instance.get("/tickets")
        return response.data
    }
}

