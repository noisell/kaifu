export type WinType = "daily" | "jackpot" | "referrer"

export type Win = {
    id: number;
    user_id: number;
    ticket_id: number;
    type: WinType;
    amount: number;
    received: boolean;
    created_at: string;
}

export type WinIndex = keyof Win