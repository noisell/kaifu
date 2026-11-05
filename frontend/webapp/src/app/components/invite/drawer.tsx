import React from "react";
import { InviteTicketIcon } from "@/app/components/invite/icons/inviteTicket";
import Link from "next/link";
import {language} from "@/app/language";

export function InviteDrawer () {
    return (
        <div className='flex flex-col w-full items-center px-7 pt-3 pb-7 bg-gradient-to-b from-[#2c2a2a] to-[#373850] rounded-t-3xl text-white'
             onClick={(e) => {e.stopPropagation()}}
        >
            <span className='w-10 h-1 bg-[#555454] rounded-xl mb-5'></span>
            <p className="text-center text-[32px] mt-5" style={{lineHeight: "38px"}}>
                {language("How frens")}<br/>{language("program works")}
            </p>
            <p className="text-[14px] text-[#909097] mt-2">Example</p>
            <div className="flex w-full items-center p-3 gap-2 rounded-2xl bg-gradient-to-r from-[#3e4044] via-[#335571] to-[#3e4044] mt-4">
                <div className="flex items-center justify-center p-2.5 bg-[#4c5762] rounded-xl">
                    <InviteTicketIcon/>
                </div>
                <p className="text-[12px]">{language("Get 20% off your friend's ticket at once")}</p>
            </div>
            <img src={"/inv.svg"} alt={""} width={"100%"} className="mt-5"/>
            <Link href={"/friends"} className="flex mt-5 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-white text-black">
                {language("Invite Friends")}
            </Link>
        </div>
    )
}