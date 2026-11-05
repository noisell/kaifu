export type TransactionType = "top_up" | "withdraw"

export type Transaction = {
    id: number;
    user_id: number;
    type: TransactionType;
    amount: number;
    gold: number;
    user_wallet: string;
    system_wallet: string | null;
    created_at: string;
}
export type TransactionIndex = keyof Transaction