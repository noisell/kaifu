export type loginData = {
    login: string
    password: string
    remember_me: boolean
}

export type User = {
    id: number
    username: string | null
    referrer_id: number | null
    avatar: string | null
    gold_coins: number
    silver_coins: number
    banned: boolean
    created_at: string
}
