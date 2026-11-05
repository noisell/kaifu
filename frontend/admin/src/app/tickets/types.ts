export type TicketType = 'gold' | 'silver'

export type Ticket = {
    id: number;
    user_id: number;
    count: number;
    type: TicketType;
    lot: number;
    number: number;
    price: number;
    active: boolean;
    updated_at: string;
    created_at: string;
}

export type TicketIndex = keyof Ticket