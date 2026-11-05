export type User = {
    id: number,
    username: string,
    referrer_id: number | null,
    avatar: string | null,
    gold_coins: number,
    silver_coins: number,
    banned: boolean,
    created_at: string | null
}