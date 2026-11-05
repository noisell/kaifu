export type JackpotType = {
    pool: number;
    users: number;
}

export type DailyType = {
    amount: number;
    count: number;
}


export type UserSchema = {
    id: number
    username: string | null
    referrer_id: number
    avatar: string | null
    gold_coins: number
    silver_coins: number
    banned: boolean
    created_at: string
}

export type TicketSchema = {
    type: "gold" | "silver"
    count: number
    id: number
    user_id: number
    lot: number
    number: number
    price: number
    active: boolean
    updated_at: string
    created_at: string
}


export type DailyReferralWinnersSchema = {
    amount: number
    username: string | null
}


export type DailyWinnersFullSchema = {
    amount: number
    user: UserSchema
    ticket: TicketSchema
    referrals: DailyReferralWinnersSchema[]
}

export type TicketWinnerType = {
    type: "gold" | "silver"
    count: number
    id: number
    user_id: number
    lot: number
    number: number
    price: number
    active: boolean
    updated_at: string
    created_at: string
    user: UserSchema
}

export type PlayJackpotType = {
    number: number
    data: TicketWinnerType | null
}