import React from 'react';
import Image from "next/image";
import {longNumberFormat} from "@/app/utils";
import {language} from "@/app/language";

interface Props {
    today: number;
    jackpot: number;
}

export function Pool(props: Props) {
    const { today, jackpot } = props;
    return (
        <>
            <p>{language("Prize Pool")}</p>
            <div className="flex w-full items-center py-3 gap-2">
                <div className="flex w-full items-start py-2 bg-[#21212c] rounded-2xl text-[14px] px-3 gap-2">
                    <div className="flex items-center justify-center px-1 py-1 bg-[#2d2c38] rounded-xl">
                        <Image src={"/gold-coin.png"} alt="" width={32} height={32}/>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[#909097] text-[10px]">{language("TODAY")}</p>
                        <p className="text-[25px] font-bold" style={{lineHeight: "25px"}}>{longNumberFormat(today)}</p>
                    </div>
                </div>
                <div className="flex w-full items-start py-2 bg-[#21212c] rounded-2xl text-[14px] px-3 gap-2">
                    <div className="flex items-center justify-center px-1 py-1 bg-[#2d2c38] rounded-xl">
                        <Image src={"/gold-coin.png"} alt="" width={32} height={32}/>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[#909097] text-[10px]">{language("JACKPOT")}</p>
                        <p className="text-[25px] font-bold" style={{lineHeight: "25px"}}>{longNumberFormat(jackpot)}</p>
                    </div>
                </div>
            </div>
        </>
    );
}