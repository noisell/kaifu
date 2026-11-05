'use client'

import React from 'react';
import {TicketSchema} from "@/app/jackpot/types";
import Image from "next/image";
import {numberFormat, padNumber} from "@/app/utils";

interface TicketInterface {
    ticket: TicketSchema
    amount: number
}

export function Ticket(props: TicketInterface) {
    const {ticket} = props;
    const number = padNumber(ticket.number.toString())
    return (
        <div className={`relative w-full flex flex-col items-center py-4 bg-[#FFF] text-black rounded-3xl mt-4 overflow-hidden`}
        >
            <div className="flex w-full items-center justify-between px-4">
                    <span className="p-2 text-xs bg-[#F0F0F0] rounded-[8px]">
                        <p className="z-10">{ticket.type == "gold" ? "Gold" : "Silver"} ticket</p>
                    </span>
                <p className="text-xs text-[#909097]">0{ticket.lot}</p>
            </div>
            <div className="flex flex-col w-full gap-1 mt-4">
                <div className="flex w-full items-center gap-1 px-4">
                    <span
                        className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#F0F0F0]"><p
                        className="z-10">{number[0]}</p></span>
                    <span
                        className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#F0F0F0]"><p
                        className="z-10">{number[1]}</p></span>
                    <span
                        className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#F0F0F0]"><p
                        className="z-10">{number[2]}</p></span>
                    <span
                        className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#F0F0F0]"><p
                        className="z-10">{number[3]}</p></span>
                    <span
                        className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#F0F0F0]"><p
                        className="z-10">{number[4]}</p></span>
                    <span
                        className="flex w-full items-center justify-center text-[36px] font-bold rounded-[10px] bg-[#F0F0F0]"><p
                        className="z-10">{number[5]}</p></span>
                </div>
            </div>
            <div className="flex w-full items-center justify-between mt-[17px] gap-2">
                <span className="w-[22px] h-[22px] rounded-full bg-[#F6A630] -ml-[11px] z-10"/>
                <div className="flex gap-2 px-1 z-10">
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>
                    <span className="w-4 h-0.5 bg-[#F6A630] rounded-full"/>

                </div>
                <span className="w-[22px] h-[22px] rounded-full bg-[#F6A630] -mr-[11px] z-10"/>
            </div>
            <div className="flex text-[45px] w-full justify-center gap-2 items-center text-center px-4 mt-[10px]">
                <span className={"flex items-center"}>
                                <Image src={"/gold-coin.png"} alt={""} width={55} height={55} className="-mt-1"/>
                                <p style={{lineHeight: "45px"}}>{numberFormat(props.amount)}</p>
                            </span>
                <p className={"text-[#BBBABA]"}>KAIFU</p>
            </div>
        </div>
    );
}