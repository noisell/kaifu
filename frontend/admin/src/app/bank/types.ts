export type Bank = {
    id: number;
    jackpot_gold: number;
    today_gold: number;
    jackpot_silver: number;
    today_silver: number;
    system: number;
}

export type BankType = "jackpot_gold" | "today_gold" | "jackpot_silver" | "today_silver" | "system"