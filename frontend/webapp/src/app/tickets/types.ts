export type TicketType = "gold" | "silver"

export type TicketSchema = {
    id: number;
    user_id: number;
    type: TicketType,
    lot: number;
    number: number | null;
    count: number;
    price: number;
    active: boolean;
    updated_at: string;
    created_at: string;
}

export type PriceTicket = {
    price: number
}

export type SetNumber = {
    lot: number
    number: number
}
export type PricePoolSchema = {
    today: number;
    jackpot: number;
}

export type TicketWon = {
    id: number;
    ticket_id: number;
    amount: number;
}