import React from 'react';
import Image from "next/image";
import {TonIcon} from "@/app/icons/ton";
import {CustomInput} from "@/app/profile/components/input";
import {language} from "@/app/language";

interface Props {
    type: "pay" | "receive";
    coin: "gold" | "ton";
    footer: string;
    color: "white" | "red";
    value: string | number | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export function SwapElement(props: Props) {
    return (
        <div className="flex flex-col w-full py-3 px-5 bg-[#272525] rounded-2xl gap-1">
            <p className="text-[12px]">{props.type == "pay" ? language("You pay") : language("You receive")}</p>
            <div className="flex w-full items-center justify-between gap-1">
                <CustomInput color={props.color} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
                {
                    props.coin === "gold" ?
                    <div className="flex items-center p-2 bg-[#313030] rounded-xl gap-1">

                        <Image src="/gold-coin.png" alt="coin" width={22} height={22}/>
                        <p className="text-[#909097] text-[18px]" style={{lineHeight: "18px"}}>GOLD</p>

                    </div>
                    :
                    <div className="flex items-center p-2 bg-[#313030] rounded-xl gap-1">
                        <div className="flex w-[22px] h-[22px] items-center justify-center">
                            <TonIcon width={19} height={19}/>
                        </div>
                        <p className="text-[#909097] text-[18px]" style={{lineHeight: "18px"}}>TON</p>
                    </div>
                }
            </div>
            <p className="text-[14px] text-[#909097]" style={{lineHeight: "14px"}}>{props.footer}</p>
        </div>
    );
}