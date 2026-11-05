'use client'

import React, {useState, useEffect} from 'react';
import {TicketSchema, TicketWon} from "@/app/tickets/types";
import {calculateTimeLeft, daysSinceDate, formatTime, formatToUserTimezone, padNumber} from "@/app/utils";
import {activateSilverTicket, setNumberTicket, ticketsWonReceived} from "@/app/tickets/api";
import {Drawer} from "@/app/components/drawer";
import {NumberDrawer} from "@/app/tickets/components/numberDrawer";
import {WinDrawer} from "@/app/tickets/components/winDrawer";
import {useNav} from "@/app/navigation/context";
import {useHeader} from "@/app/header/context";
import {language} from "@/app/language";

interface TicketInterface {
    ticket: TicketSchema
    won?: TicketWon
    wins: TicketWon[]
}

export function Ticket(props: TicketInterface) {
    const {ticket} = props;
    const {setCountWon, countWon} = useNav()
    const {setGold, gold} = useHeader()
    const [wins, setWins] = useState<TicketWon[]>(props.wins);
    const [active, setActive] = useState<boolean>(ticket.active);
    const [number, setNumber] = useState<string>(ticket.number? padNumber(ticket.number.toString()) : "ㅤㅤㅤㅤㅤㅤ");
    const [updatedAt, setUpdated_at] = useState(formatToUserTimezone(ticket.updated_at))
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(updatedAt));
    const [lot, setLot] = useState<number>(ticket.lot);
    const [open, setOpen] = useState<boolean>(false);
    const [openClaim, setOpenClaim] = useState<boolean>(false);
    const daysLatter = daysSinceDate(formatToUserTimezone(ticket.created_at));

    useEffect(() => {
        if (active && ticket.type == "silver") {
            const intervalId = setInterval(() => {
                setTimeLeft(calculateTimeLeft(updatedAt));
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [active]);

    const handleActivate = (): void => {
        setUpdated_at((new Date).toString())
        setActive(true);
        activateSilverTicket(ticket.id).then()
    }

    const handleSetNumber = (num: number | null) => {
        setNumberTicket(ticket.id, num).then(r => {
            setNumber(padNumber(r.number.toString()))
            setLot(r.lot)
        })
    }

    const onClose = (lot: number, number: number) => {
        setLot(lot)
        setNumber(padNumber(number.toString()))
        setOpen(false);
    }

    const onCloseWon = () => {
        if (wins.length > 0) {
            ticketsWonReceived(ticket.id).then()
            setOpenClaim(false)
            setCountWon(countWon - wins.length)
            setWins([])
            const totalAmountWon = wins.reduce((sum, ticket) => sum + ticket.amount, 0);
            setGold(gold + totalAmountWon)
        }
    }

    return (
        <div className={`relative w-full flex flex-col items-center py-4 bg-[#323030] rounded-3xl mt-4 overflow-hidden ${ticket.type == "gold" && number === "ㅤㅤㅤㅤㅤㅤ" && "cursor-pointer"}`}
             onClick={() => {
                 if (ticket.type == "gold" && number === "ㅤㅤㅤㅤㅤㅤ") {
                     setOpen(!open);
                 }
             }}
        >

            {wins.length > 0 ? <div className="glareRoundBig glareRoundWinTicket"/> :
                <>
                    {ticket.type == "gold" && <div className="glareRoundBig glareRoundGoldTicket"/>}
                    {ticket.type == "gold" && <div className="glareRoundBig glareRoundSilverTicket"/>}
                </>
            }
            <div className="flex w-full items-center justify-between px-4">
                    <span className="p-2 text-xs bg-[#3c3a3a] rounded-[8px]">
                        <p className="z-10">{ticket.type == "gold" ? language("Gold") : language("Silver")} {language("ticket")}</p>
                    </span>
                <p className="text-xs text-[#909097]">0{lot}</p>
            </div>
            <div className="flex flex-col w-full gap-1 mt-4">
                {Array.from({ length: ticket.count }).map((_, index) =>
                    <div className="flex w-full items-center gap-1 px-4" key={index}>
                        <span
                            className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#3c3a3a]"><p
                            className="z-10">{number[0]}</p></span>
                        <span
                            className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#3c3a3a]"><p
                            className="z-10">{number[1]}</p></span>
                        <span
                            className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#3c3a3a]"><p
                            className="z-10">{number[2]}</p></span>
                        <span
                            className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#3c3a3a]"><p
                            className="z-10">{number[3]}</p></span>
                        <span
                            className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#3c3a3a]"><p
                            className="z-10">{number[4]}</p></span>
                        <span
                            className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#3c3a3a]"><p
                            className="z-10">{number[5]}</p></span>
                    </div>
                )}
            </div>
            <div className="flex w-full items-center mt-[17px] gap-2">
                <span className="w-[22px] h-[22px] rounded-full bg-[#1B1919] -ml-[11px] z-10"/>
                <div className="flex w-full gap-2 px-1 z-10">
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                    <span className="w-full h-0.5 bg-[#1B1919] rounded-full"/>
                </div>
                <span className="w-[22px] h-[22px] rounded-full bg-[#1B1919] -mr-[11px] z-10"/>
            </div>
            <div className="flex flex-col w-full items-center text-center px-4 mt-[10px]">
                {
                    wins.length > 0
                    ?
                        <>
                            <p className="text-[24px]">{language("You won")}!</p>
                            <p className="text-[12px] mb-2 text-[#909097] z-10">{language("Information on how to get the winnings")}</p>
                            <button
                                onClick={() => setOpenClaim(true)}
                                className="flex items-center justify-center w-full py-3.5 rounded-2xl text-[14px] text-black bg-[#12F29A]">
                                {language("Claim")}
                            </button>
                        </>
                    :
                    ticket.type == "gold" ?
                        number === "ㅤㅤㅤㅤㅤㅤ" ?
                                <>
                                    <p className="text-[12px] mb-2 z-10">{language("Enter ticket number or setup random")}</p>
                                    <button
                                        className="flex items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-[#5F5A5D]"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleSetNumber(null)
                                        }}
                                >
                                    <p className="z-10">{language("Random number")}</p>
                                </button>
                            </>
                            :
                            <>
                                <p className="text-[16px] mb-2 text-[#909097] z-10">{language("Ticket in game")}</p>
                                <p className="text-[24px]">{daysLatter} {language("Days")}</p>
                            </>
                        :
                        active ?
                            <>
                                <p className="text-[16px] text-[#909097]">{language("Ticket in game")}</p>
                                <p className="text-[24px]">{formatTime(timeLeft)}</p>
                            </>
                            :
                            <>
                                <button
                                    onClick={handleActivate}
                                    className="flex items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gradient-to-r from-[#0D70F2] to-[#0DAEF2]">
                                    {language("Activate ticket")}
                                </button>
                            </>
                }
            </div>
            <Drawer open={open} setOpen={setOpen} content={<NumberDrawer ticketId={ticket.id} onClose={onClose}/>}/>
            {wins && <Drawer open={openClaim} setOpen={setOpenClaim} content={<WinDrawer amount={wins.reduce((sum, ticket) => sum + ticket.amount, 0)} onClose={onCloseWon} />}/>}
        </div>
    );
}