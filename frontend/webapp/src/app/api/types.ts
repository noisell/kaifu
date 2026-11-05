export type loginData = {
    user_id: number
    username: string | null
    initData: string
    avatar?: string | null
}

export type systemNames = "course" | "price_gold_ticket" | "price_silver_ticket" | "wallet" | "price_gold_ticket_stars"

export type systemData = {
    name: systemNames,
    value: string
}