export type TypeHistoryMoney = "top_up" | "withdraw";

export type TypeHistoryWon = "daily" | "jackpot" | "referrer";

export type History = {
    type: TypeHistoryWon | TypeHistoryMoney;
    gold: number;
    amount: number | null;
    created_at: string;
}

export type HistoryUpdate = {
    type: TypeHistoryMoney
    amount: number,
    gold: number;
    user_wallet: string
    system_wallet: string | null
}