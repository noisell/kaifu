'use client'

import React, {useState, useEffect, useRef} from 'react';
import {numberFormat} from "@/app/utils";
import {useTelegram} from "@/app/telegram/context";
import {language} from "@/app/language";
import {ShareIcon} from "@/app/tickets/icons/share";

interface Props {
    amount: number;
    onClose: () => void;
}

export function WinDrawer(props: Props) {

    const [refURL, setRefURL] = useState<string>('');
    const text = `\n🎉 ${language("I just won")} ${props.amount} KAIFU! ${language("Now it's your turn — join, participate in the sweepstakes and win with me!")}\n\n${language("KAIFU is a chance to win and exchange for real rewards. Don't miss the opportunity!")}`;
    const { webApp, user } = useTelegram()
    const myDivRef = useRef<HTMLDivElement>(null);

    const handleShare = async () => {
        Telegram.WebApp.openTelegramLink(
            `https://t.me/share/url?url=${refURL}&text=${encodeURIComponent(text)}`,
        )

    }

    useEffect(() => {
        if (webApp && user) {
            setRefURL(`${process.env.NEXT_PUBLIC_BOT_URL}?startapp=friend${user.id}`)
        }
    }, [user])

    return (
        <div className='flex flex-col w-full items-center px-7 pt-3 pb-7 bg-[#28292D] rounded-t-3xl text-white' ref={myDivRef}
             onClick={(e) => e.stopPropagation()}>
            <span className='w-10 h-1 bg-[#555454] rounded-xl mb-5 z-10'></span>
            <p className="text-center text-[32px] mt-1 z-10" style={{lineHeight: "34px"}}>{language("Your ticket won")}!</p>
            <p className="text-[14px] text-[#909097] mt-1 text-center z-10">{language("Information on how to get the winnings")}</p>
            <div className="relative flex flex-col items-center mt-5 w-full py-10 bg-[#394750] rounded-3xl">
                <div className="glareRoundBig glareRoundWinDrawer"/>
                <img src={"/gold-coin.png"} alt={"coin"} width={"60%"} className="z-10"/>
                <p className="font-bold text-[36px] z-10">{numberFormat(props.amount)}</p>
            </div>
            <button
                onClick={props.onClose}
                className="flex mt-5 items-center z-10 justify-center w-full py-3.5 rounded-2xl text-[14px] text-black bg-[#12F29A]">
                {language("Claim")}
            </button>
            <button
                onClick={handleShare}
                className="flex mt-2 gap-2 items-center z-10 justify-center w-full py-3.5 rounded-2xl text-[14px] text-white bg-[#717294]">
                {language("Share")} <ShareIcon/>
            </button>
        </div>
    );
}