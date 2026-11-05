'use client'
import React, {useState, useEffect} from 'react';
import {CardBank} from "@/app/bank/card";
import {useNav} from "@/app/navigation/context";
import {TonIcon} from "@/app/bank/ton";
import {getBank} from "@/app/bank/api";
import {Bank} from "@/app/bank/types";
import {LoadingItem} from "@/app/components/loading";
import {getSettings, getSystemValue} from "@/app/settings/api";
import {Star} from "@/app/bank/star";
import {System} from "@/app/settings/types";

export default function PageBank() {
    const {setShowNavigation, setActive} = useNav()
    const [data, setData] = useState<Bank>();
    const [stars, setStars] = useState<number>(0);

    const [iSilver, setISilver] = useState<number>(0)
    const [iSilverJackpot, setISilverJackpot] = useState<number>(0)
    const [iGold, setIGold] = useState<number>(0)
    const [iGoldJackpot, setIGoldJackpot] = useState<number>(0)

    useEffect(() => {
        getBank().then(r => {
            setData(r)
            setShowNavigation(true)
            setActive("/bank")
        })
        getSystemValue("stars").then(r => {
            setStars(Number(r.value))
        })
        getSettings().then(r => {
            r.forEach((value) => {
                if (value.name == "investment_gold") {
                    setIGold(Number(value.value))
                }
                else if (value.name == "investment_silver") {
                    setISilver(Number(value.value))
                }
                else if (value.name == "investment_silver_jackpot") {
                    setISilverJackpot(Number(value.value))
                }
                else if (value.name == "investment_gold_jackpot") {
                    setIGoldJackpot(Number(value.value))
                }
            })
        })
    }, []);
    return (
        data ?
            <div className="section">
                <div className="flex flex-col w-full">
                    <h1 className={"text-[32px] mb-2 ml-3"}>Золотые</h1>
                    <div className="flex w-full items-center gap-5">
                        <CardBank type={"today_gold"} invest={iGold} investAll={15000000} title={"Ежедневные"} count={data.today_gold} changeCount={(count: number) => {setData(prevState => ({...data, today_gold: count}))}} img={"/gold-coin.png"} change prefix={"GOLD"}/>
                        <CardBank type={"jackpot_gold"} invest={iGoldJackpot} investAll={7500000} title={"Джекпот"} count={data.jackpot_gold} changeCount={(count: number) => {setData(prevState => ({...data, jackpot_gold: count}))}} img={"/gold-coin.png"} change prefix={"GOLD"}/>
                    </div>
                    <h1 className={"text-[32px] mb-2 ml-3 mt-7"}>Серебрянные</h1>
                    <div className="flex w-full items-center gap-5">
                        <CardBank type={"today_silver"} invest={iSilver} investAll={1500000} title={"Ежедневные"} count={data.today_silver} changeCount={(count: number) => {setData(prevState => ({...data, today_silver: count}))}} img={"/silver-coin.png"} change prefix={"GOLD"}/>
                        <CardBank type={"jackpot_silver"} invest={iSilverJackpot} investAll={750000} title={"Джекпот"} count={data.jackpot_silver} changeCount={(count: number) => {setData(prevState => ({...data, jackpot_silver: count}))}} img={"/silver-coin.png"} change prefix={"GOLD"}/>
                    </div>
                    <h1 className={"text-[32px] mb-2 ml-3 mt-7"}>Компания</h1>
                    <div className="flex w-full items-center gap-5">
                        <CardBank type={"system"} title={"Прибыль компании"} count={data.system} changeCount={(count: number) => {setData(prevState => ({...data, system: count}))}} img={<TonIcon width={100} height={100}/>} prefix={"TON"}/>
                        <CardBank type={"stars"} title={"Баланс STARS"} count={stars} changeCount={(count: number) => {setStars(count)}} img={<Star/>} prefix={"STARS"}/>
                    </div>
                </div>
            </div>
            : <LoadingItem/>
    );
};