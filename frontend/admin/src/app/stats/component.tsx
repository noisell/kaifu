'use client'

import React, {useState, useEffect} from 'react';
import {Card} from "@/app/stats/card";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {MoneyStats, TicketStats, UserStats} from "@/app/stats/types";
import {getMoneyStats, getTicketStats, getUserStats} from "@/app/stats/api";
import {LoadingItem} from "@/app/components/loading";
import {useNav} from "@/app/navigation/context";
import {authentication} from "@/app/api";
import {ComponentAuth} from "@/app/auth/component";

export function ComponentStats() {
    const [login, setLogin] = useState<boolean | undefined>(undefined);
    const {setShowNavigation, showNavigation} = useNav()

    useEffect(() => {
        authentication().then(r => {
            setLogin(r)
            setShowNavigation(r)
        })
    }, []);

    const [dataMoney, setDataMoney] = useState<MoneyStats>();
    const [dataUser, setDataUser] = useState<UserStats>();
    const [dataTicket, setDataTicket] = useState<TicketStats>();
    const [dataTicketActive, setDataTicketActive] = useState<TicketStats>();
    const countLoadings = 1
    const [loading, setLoading] = useState<number>(0);

    useEffect(() => {
        getMoneyStats().then(r => {
            setDataMoney(r);
            setLoading(prevState => prevState + 1)
        })
        getUserStats().then(r => {
            setDataUser(r)
            setLoading(prevState => prevState + 1)
        })
        getTicketStats().then(r => {
            setDataTicket(r);
        })
        getTicketStats(true).then(r => {
            setDataTicketActive(r);
        })
    }, []);
    return (
        login === undefined || dataMoney == undefined || dataUser == undefined || dataTicket == undefined || dataTicketActive == undefined ? <LoadingItem/>
            : login ?
                <div className="section">
                    <div className="flex flex-col w-full">
                        <h1 className={"text-[32px] mb-2 ml-3"}>Пополнения</h1>
                        <div className="flex w-full items-center gap-5">
                            <Card title={"Сегодня"} all={dataMoney.today} prefix={"TON"}/>
                            <Card title={"Месяц"} all={dataMoney.mouth} prefix={"TON"}/>
                            <Card title={"Всего"} all={dataMoney.all} prefix={"TON"}/>
                        </div>
                        <div className="flex w-full items-center h-auto" style={{fontSize: '10px', color: '#1777FF'}}>
                            <ResponsiveContainer width="100%" height={500}>
                                <AreaChart
                                    data={dataMoney.data}
                                    margin={{
                                        top: 30,
                                        right: 10,
                                        left: -25,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1777FF" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f5f5f5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0 1" stroke="#cccccc" className="grid"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis dataKey="profit"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFF',
                                            borderRadius: '10px',
                                            border: "1px solid #cccccc",
                                        }}
                                        itemStyle={{
                                            color: '#000',
                                        }}
                                    />
                                    <Area type="monotone" dataKey='profit' fill="url(#colorUv)"
                                          stroke="#1777FF"/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <h1 className={"text-[32px] mb-2 ml-3 mt-7"}>Пользователи</h1>
                        <div className="flex w-full items-center gap-5">
                            <Card title={"Всего"} all={dataUser.all.all} today={dataUser.all.today} prefix={"чел."}/>
                            <Card title={"Пополнили баланс"} all={dataUser.top_up.all} today={dataUser.top_up.today}
                                  prefix={"чел."}/>
                            <Card title={"По рефералке"} all={dataUser.ref.all} today={dataUser.ref.today}
                                  prefix={"чел."}/>
                        </div>
                        <div className="flex w-full items-center gap-5 mt-5">
                            <Card title={"Выполнили все задания"} all={dataUser.completed_task} prefix={"чел."}/>
                            <Card title={"Заблокировано"} all={dataUser.banned} prefix={"чел."}/>
                            <Card title={"Неактивных"} all={dataUser.not_active} prefix={"чел."}/>
                        </div>
                        <div className="flex w-full items-center h-auto" style={{fontSize: '10px', color: '#1777FF'}}>
                            <ResponsiveContainer width="100%" height={500}>
                                <AreaChart
                                    data={dataUser.data}
                                    margin={{
                                        top: 30,
                                        right: 10,
                                        left: -25,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1777FF" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f5f5f5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0 1" stroke="#cccccc" className="grid"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis dataKey="count"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFF',
                                            borderRadius: '10px',
                                            border: "1px solid #cccccc",
                                        }}
                                        itemStyle={{
                                            color: '#000',
                                        }}
                                    />
                                    <Area type="monotone" dataKey='count' fill="url(#colorUv)"
                                          stroke="#1777FF"/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <h1 className={"text-[32px] mt-7 mb-2 ml-3"}>Куплено билетов</h1>
                        <div className="flex w-full items-center gap-5">
                            <Card title={"Золотых"} all={dataTicket.gold.all} today={dataTicket.gold.today}
                                  prefix={"шт."}/>
                            <Card title={"Серебряных"} all={dataTicket.silver.all} today={dataTicket.silver.today}
                                  prefix={"шт."}/>
                        </div>
                        <div className="flex w-full items-center h-auto" style={{fontSize: '10px', color: '#1777FF'}}>
                            <ResponsiveContainer width="100%" height={500}>
                                <AreaChart
                                    data={dataTicket.data}
                                    margin={{
                                        top: 30,
                                        right: 10,
                                        left: -25,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1777FF" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f5f5f5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0 1" stroke="#cccccc" className="grid"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis dataKey="count"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFF',
                                            borderRadius: '10px',
                                            border: "1px solid #cccccc",
                                        }}
                                        itemStyle={{
                                            color: '#000',
                                        }}
                                    />
                                    <Area type="monotone" dataKey='count' fill="url(#colorUv)"
                                          stroke="#1777FF"/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <h1 className={"text-[32px] mt-7 mb-2 ml-3"}>Активные билеты</h1>
                        <div className="flex w-full items-center gap-5">
                            <Card title={"Золотые"} all={dataTicketActive.gold.all} prefix={"шт."}/>
                            <Card title={"Серебрянные"} all={dataTicketActive.silver.all} prefix={"шт."}/>
                        </div>
                        <div className="flex w-full items-center h-auto" style={{fontSize: '10px', color: '#1777FF'}}>
                            <ResponsiveContainer width="100%" height={500}>
                                <AreaChart
                                    data={dataTicketActive.data}
                                    margin={{
                                        top: 30,
                                        right: 10,
                                        left: -25,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1777FF" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f5f5f5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0 1" stroke="#cccccc" className="grid"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis dataKey="count"/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFF',
                                            borderRadius: '10px',
                                            border: "1px solid #cccccc",
                                        }}
                                        itemStyle={{
                                            color: '#000',
                                        }}
                                    />
                                    <Area type="monotone" dataKey='count' fill="url(#colorUv)"
                                          stroke="#1777FF"/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                :
                <div className="section"><ComponentAuth callback={() => {
                    setLogin(true);
                    setShowNavigation(true);
                }}/></div>
    );
}