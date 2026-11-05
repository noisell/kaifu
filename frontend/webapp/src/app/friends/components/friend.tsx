import React from 'react';
import Image from "next/image";
import {numberFormat} from "@/app/utils";
import {AvatarBase} from "@/app/components/avatarBase";

interface Props {
    username: string | null;
    avatar: string | null;
    goldCoins: number;
}

export function Friend(props: Props) {
    const {username, avatar, goldCoins} = props
    return (
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-white">
                {avatar ?
                    <img src={avatar} alt="" className="rounded-full h-[36px] w-[36px]"/>
                    :
                    <AvatarBase username={username}/>
                }
                <p>@{username ? username : "Unknown"}</p>
            </div>
            <div className="flex items-center gap-2 text-[18px]">
                <span className="flex gap-1 items-center">
                    <Image src={"/gold-coin.png"} alt="coin" width={22} height={22}/>
                    <p>{numberFormat(goldCoins)}</p>
                </span>
                <p className="text-[#909097]">KAIFU</p>
            </div>
        </div>
    );
}