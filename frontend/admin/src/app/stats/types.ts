export type DataMoneyStats = {
    name: string
    profit: number
}

export type MoneyStats = {
    today: number;
    mouth: number;
    all: number;
    data: DataMoneyStats[]
}

export type UserTypeStats = {
    all: number
    today: number
}

export type DataUserStats = {
    name: string
    count: number
}

export type UserStats = {
    all: UserTypeStats
    top_up: UserTypeStats
    completed_task: number
    ref: UserTypeStats
    banned: number
    not_active: number
    data: DataUserStats[]
}

export type TicketStats = {
    gold: UserTypeStats
    silver: UserTypeStats
    data: DataUserStats[]
}
