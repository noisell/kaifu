import {lotteryInstance} from "@/app/tickets/api";
import {DailyType, DailyWinnersFullSchema, JackpotType, PlayJackpotType} from "@/app/jackpot/types";

// export async function getJackpot(type: "gold" | "silver"): Promise<JackpotType> {
//     const instance = await lotteryInstance()
//     const response = await instance.get(`/jackpot/${type}`)
//     return response.data
// }

export async function amountJackpot(): Promise<number> {
    const instance = await lotteryInstance()
    const response = await instance.get(`/jackpot/amount`)
    return response.data
}

export async function getDailyAmounts(): Promise<DailyType[]> {
    const instance = await lotteryInstance()
    const response = await instance.get('/daily')
    return response.data
}

export async function getDailyWinners(): Promise<DailyWinnersFullSchema[]> {
    const instance = await lotteryInstance()
    const response = await instance.get('/winners/daily')
    return response.data
}

export async function playJackpot(): Promise<PlayJackpotType> {
    const instance = await lotteryInstance()
    const response = await instance.post('/jackpot')
    return response.data
}