'use client'

import React, {useState, useEffect} from 'react';
import Image from "next/image";
import {amountJackpot, getDailyAmounts, getDailyWinners, playJackpot} from "@/app/jackpot/api";
import {useNav} from "@/app/navigation/context";
import {TicketIcon} from "@/app/jackpot/ticketIcon";
import {DailyType, DailyWinnersFullSchema, PlayJackpotType} from "@/app/jackpot/types";
import {numberFormat} from "@/app/utils";
import {Ticket} from "@/app/jackpot/ticket";

export default function PageJackpot() {
    const [jackpotAmount, setJackpotAmount] = useState<number>(0)
    const {setShowNavigation, setActive} = useNav()
    const [dailyData, setDailyData] = useState<DailyType[]>([])
    const [dailyWinners, setDailyWinners] = useState<DailyWinnersFullSchema[]>([])
    const [page, setPage] = useState<"main" | "daily" | "jackpot" | "loading">("main");
    const [jackpotData, setJackpotData] = useState<PlayJackpotType>()

    useEffect(() => {
        setShowNavigation(false)
        setActive("/jackpot")
        amountJackpot().then(r => setJackpotAmount(r))
        getDailyAmounts().then(r => r.length === 3 ? setDailyData(r) : setDailyData([{amount: 0, count: 0}, {amount: 0, count: 0}, {amount: 0, count: 0}]))
    }, []);

    const handleClickDaily = () => {
        setPage("loading")
        getDailyWinners().then(r => {
            setDailyWinners(r)
            setPage("daily")
        })
    }

    const handleClickJackpot = () => {
        if (jackpotAmount) {
            setPage("loading")
            playJackpot().then(r => {
                setJackpotData(r)
                setPage("jackpot")
            })
        }
    }

    const main = (): React.ReactNode => {
        return (
            <>
                <div className="blur-container blur-container-top"/>
                <h1 className={"text-[42px] text-white font-medium z-10"}>Prize pool</h1>
                <h2 className={"text-xl text-[#9F9B97] mt-[50px]"}>DAILY</h2>
                <div className="flex items-center gap-6 cursor-pointer" onClick={handleClickDaily}>
                    {dailyData.map((daily: DailyType, index: number) => (
                        <div
                            key={index}
                            className="relative bg-[#2A2929] mt-[40px] text-[25px] flex items-center gap-2 border border-[#525151] rounded-[40px] py-[40px] px-[35px]">
                            <div className="absolute flex -left-12 -top-12">
                                <div className={"relative flex"}>
                                    <TicketIcon/>
                                    <p className={`absolute flex bottom-11 ${daily.count < 10 ? 'left-16' : daily.count < 100 ? 'left-14' : 'left-12'} text-black text-[32px]`}
                                       style={{transform: 'rotate(-30deg)', lineHeight: "32px"}}>
                                        {daily.count}
                                    </p>
                                </div>
                            </div>
                            <span className={"flex items-center"}>
                                <Image src={"/gold-coin.png"} alt={""} width={32} height={32}/>
                                <p>{numberFormat(daily.amount)}</p>
                            </span>
                            <p className={"text-[#9F9B97]"}>KAIFU</p>
                        </div>
                    ))}
                </div>
                <h2 className={"text-[30px] text-[#9F9B97] mt-[100px]"}>JACKPOT</h2>
                <button className={"flex text-[55px] font-medium mt-[40px] items-center justify-center px-[40px] py-[30px] gap-3 bg-[#F4A331] rounded-[44px]"}
                        onClick={handleClickJackpot}
                >
                    <span className={"flex items-center"}>
                        <Image src={"/gold-coin.png"} alt={""} width={80} height={80}/>
                        <p>{numberFormat(Number(jackpotAmount.toFixed(0)))}</p>
                    </span>
                    <p className={"text-[#FDD8A0]"}>KAIFU</p>
                </button>
                <div className="blur-container blur-container-bottom"/>
            </>
        )
    }

    const loadingComponent = (): React.ReactNode => {
        return (
            <>
                <Image src={"/logo.svg"} alt={"logo"} width={55} height={85} className={"mt-[40vh]"}/>
                <p className={"text-white text-[24px] mt-[50px]"}>Determining winners...</p>
            </>
        )
    }

    const dailyComponent = (): React.ReactNode => {
        return (
            dailyWinners.length > 10 ? dailyWinners.map((item: DailyWinnersFullSchema, index: number) => (
                <div key={index} className={"relative w-full flex flex-col items-center mb-[140px]"}>
                    <div className="blur-container blur-container-top-ticket"/>
                    <Image src={"/wide.svg"} alt={""} width={35} height={35} className={"absolute left-0 top-[150px]"}/>
                    <Image src={"/wide.svg"} alt={""} width={35} height={35} className={"absolute right-24 -top-10"}/>
                    <Image src={"/4.svg"} alt={""} width={70} height={70} className={"absolute left-10 top-[300px]"}/>
                    <Image src={"/7.svg"} alt={""} width={100} height={100} className={"absolute right-8 top-[150px]"}/>
                    <div
                        className={"relative z-10 flex w-[80%] flex-col items-center px-[60px] py-[40px] bg-[#F6A630] rounded-[30px]"}>
                        <Image src={"/big-star.svg"} alt={""} width={110} height={110}
                               className={"absolute -left-9 -top-10"}/>
                        <Image src={"/big-star.svg"} alt={""} width={50} height={50}
                               className={"absolute -right-6 bottom-10"}/>
                        <h1 className={"text-[100px] font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#F5B24E]"}
                            style={{lineHeight: "100px", fontWeight: "700"}}>
                            Winner
                        </h1>
                        <p className={"text-white text-[24px]"}
                           style={{lineHeight: "24px"}}>{item.user.username ? `${item.user.username[0]}*****${item.user.username[item.user.username.length - 1]}` : 'Unknown'}</p>
                        <Ticket ticket={item.ticket} amount={item.amount}/>
                    </div>
                    {item.referrals.length > 0 && (
                        <div className={"relative flex w-full items-center mt-14 flex-col"}>
                            <div className="blur-container blur-container-ref"/>
                            <h2 className={"text-[24px] mb-5 z-10"}>Frens rewards</h2>
                            {item.referrals.map((item, index) => (
                                <div
                                    className={"flex text-[24px] bg-opacity-50 mb-1 text-white items-center justify-between bg-[#293C4E] rounded-3xl py-5 px-7 w-5/12"}
                                    key={index}>
                                    <p className={"z-10"}>{item.username ? `${item.username[0]}*****${item.username[item.username.length - 1]}` : 'Unknown'}</p>
                                    <span className={"z-10 flex items-center gap-2.5"}>
                                        <span className={"flex items-center gap-1"}>
                                            <Image src={"/gold-coin.png"} alt={""} width={32} height={32}/>
                                            <p>{numberFormat(item.amount)}</p>
                                        </span>
                                        <p className={"text-[#7C929F]"}>KAIFU</p>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))
                :
                <p>There are no winners yet.. Please reload this page</p>
        )
    }

    const jackpotComponent = (): React.ReactNode => {
        return (
            <>
            </>
        )
    }

    return (
        <div className="section flex-col w-screen bg-[#1B1919] text-white" style={{margin: 0, paddingRight: "80px", paddingLeft: "80px", alignItems: "center", paddingTop: "60px"}}>
            {
                page == "main"
                    ? main()
                    : page == "daily"
                        ? dailyComponent()
                        : page == "jackpot"
                            ? jackpotComponent()
                            : loadingComponent()
            }
        </div>
    );
};