export type SystemNames =
    "course"
    | "course_stars"
    | "price_gold_ticket"
    | "price_gold_ticket_stars"
    | "price_silver_ticket"
    | "wallet"
    | "today"
    | "stars"
    | "investment_silver"
    | "investment_gold"
    | "investment_gold_jackpot"
    | "investment_silver_jackpot"

export type SystemNames2 =
    "count_first"
    | "percent_first"
    | "count_second"
    | "percent_second"
    | "count_third"
    | "percent_third"

export type System = {
    name: SystemNames | SystemNames2;
    value: string;
}