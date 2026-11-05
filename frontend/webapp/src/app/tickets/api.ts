import {axiosBaseInstance} from "@/app/api";
import {PricePoolSchema, PriceTicket, SetNumber, TicketSchema, TicketType, TicketWon} from "@/app/tickets/types";

export async function lotteryInstance() {
    return await axiosBaseInstance(false, "/lottery")
}

export async function buyTicket(type: TicketType, count: number = 1): Promise<PriceTicket | void> {
    const instance = await lotteryInstance()
    try {
        const response = await instance.post("/ticket", {type: type, count: count});
        return response.data
    }
    catch (error) {
        return Telegram.WebApp.showPopup({
            title: 'Insufficient funds',
            message: 'Top up your balance and try again',
            buttons: [{ id: 'ok', type: 'ok'}],
        });
    }
}

export async function getAllTickets(): Promise<TicketSchema[]> {
    const instance = await lotteryInstance()
    const response = await instance.get("/tickets")
    return response.data
}

export async function activateSilverTicket(ticketId: number): Promise<void> {
    const instance = await lotteryInstance()
    await instance.post("/ticket/activate", {id: ticketId})
}

export async function setNumberTicket(ticketId: number, number: number | null): Promise<SetNumber> {
    const instance = await lotteryInstance()
    const response = await instance.post("/ticket/number", {id: ticketId, number: number})
    return response.data
}

export async function checkNumber(ticketId: number, number: number): Promise<boolean> {
    const instance = await lotteryInstance()
    const response = await instance.get("/ticket/number/check", {params: {ticket_id: ticketId, number: number}})
    return response.data
}

export async function getPricePool(): Promise<PricePoolSchema> {
    const instance = await lotteryInstance()
    const response = await instance.get("/pool")
    return response.data
}

export async function getCountTicketsWon(): Promise<number> {
    const instance = await lotteryInstance()
    const response = await instance.get("/won/count")
    return response.data
}

export async function getTicketsWon(): Promise<TicketWon[]> {
    const instance = await lotteryInstance()
    const response = await instance.get("/won/tickets")
    return response.data
}

export async function ticketsWonReceived(ticketId: number): Promise<void> {
    const instance = await lotteryInstance()
    await instance.post("/won/received", {id: ticketId})
}

export async function getInvoiceLink(count: number, lang: string): Promise<string> {
    const instance = await lotteryInstance()
    const response = await instance.get("/invoice", {params: {count: count, lang: lang}})
    return response.data
}