'use client'

import React from 'react';
import {numberFormat} from "@/app/utils";
import Image from "next/image";
import {useHeader} from "@/app/header/context";
import {useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {language} from "@/app/language";

export function WalletSection() {
    const {gold, silver} = useHeader()
    const address = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    return (
        <div className="flex flex-col w-full items-center gap-1">
            <div className="flex w-full items-center gap-1 py-2 px-4 bg-[#272525] rounded-[20px]">
                <div className="flex flex-col w-full gap-0.5">
                    <p className="text-[22px]" style={{lineHeight: "22px"}}>{numberFormat(silver)}</p>
                    <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>KAIFU</p>
                </div>
                <Image src="/silver-coin.png" alt="coin" width={52} height={52}/>
            </div>
            <div className="flex w-full items-center gap-1 py-2 px-4 bg-[#272525] rounded-[20px]">
                <div className="flex flex-col w-full gap-0.5">
                    <p className="text-[22px]" style={{lineHeight: "22px"}}>{numberFormat(gold)}</p>
                    <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>GOLD</p>
                </div>
                <Image src="/gold-coin.png" alt="coin" width={52} height={52}/>
            </div>
            {address &&
                <div className="absolute w-full px-4 bottom-[90px]">
                    <button className="w-full rounded-xl bg-[#393955] text-white text-[14px] py-4 text-center"
                            onClick={() => {
                                tonConnectUI.disconnect().then();
                            }}
                    >
                        {language("Disconnect wallet")}
                    </button>
                </div>
            }
        </div>
    )
}