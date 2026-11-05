export type DataType = {
    id: number
    key: string
    username: string | null
    referrer_id: number | null
    avatar: string | null
    gold_coins: number
    silver_coins: number
    banned: string
    created_at: string
}
export type DataIndex = keyof DataType;