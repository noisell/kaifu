'use client'

import React, {useEffect } from 'react'
import Image from "next/image";
import {useHeader} from "@/app/header/context";
import {useTonAddress, useTonConnectModal} from "@tonconnect/ui-react";
import {useNav} from "@/app/navigation/context";
import {getUserInfo} from "@/app/header/api";
import {WalletIcon} from "@/app/header/icons/wallet";
import {AvatarBase} from "@/app/components/avatarBase";
import {longNumberFormat} from "@/app/utils";
import Link from "next/link";
import {getSystemData} from "@/app/api/system";
import {useRouter} from "next/navigation";

export function HeaderComponent() {
    const { avatar, setAvatar, name, setName, silver, setSilver, gold, setGold, course } = useHeader()
    const { showNavigation, setActiveButton } = useNav()
    const { setPriceGold, setPriceSilver, setCourse } = useHeader()
    const { open } = useTonConnectModal();
    const router = useRouter()

    const address = useTonAddress();

    useEffect(() => {
        Telegram.WebApp.SettingsButton.isVisible = true
        Telegram.WebApp.SettingsButton.onClick(() => {router.push("/settings")})
        if (showNavigation) {
            getUserInfo().then(
                user => {
                    if (user.avatar) setAvatar(user.avatar);
                    setName(user.username);
                    setSilver(user.silver_coins);
                    setGold(user.gold_coins);
                }
            )
            getSystemData().then(
                r => {
                    setPriceSilver(Number(r.find((value) => value.name == "price_silver_ticket")?.value as string))
                    setPriceGold(Number(r.find((value) => value.name == "price_gold_ticket")?.value as string))
                    setCourse(Number(r.find((value) => value.name == "course")?.value as string))
                }
            )
        }
    }, [showNavigation]);
    if (!showNavigation) return null
    return (
        <header>
            <p className="text-[10px] mt-2">1 GOLD = {course} TON</p>
            <Link href={"/profile"} className="flex w-full items-center mt-1 py-2 px-3 bg-[#2d2d46] rounded-2xl text-[14px] justify-between cursor-pointer"
                  onClick={() => {
                      Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                      setActiveButton('/')
                  }}
            >
                <div className="flex items-center justify-start gap-2">
                    {avatar ?
                        <img src={avatar} alt="" className="rounded-full h-[36px] w-[36px]"/>
                        :
                        <AvatarBase username={name}/>
                    }
                    <div className="flex flex-col justify-between text-[14px]">
                        <p className="text-[12px]">{name ? `@${name}` : "@Unknown"}</p>
                        <div className="flex items-center gap-2 font-bold">
                            <div className="flex items-center gap-0.5">
                                <Image src={"/silver-coin.png"} alt="" width={18} height={18}/>
                                <p>{longNumberFormat(silver)}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <Image src={"/gold-coin.png"} alt="" width={18} height={18}/>
                                <p>{longNumberFormat(gold)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    address ?
                        <div className="flex items-center py-2 px-3 bg-[#363645] rounded-[12px] gap-0.5">
                            <span className="flex"><WalletIcon white={true}/></span>
                            <p className="text-white text-[12px]" style={{lineHeight: "14px"}}>{address.substring(0, 5) + "..." + address.substring(address.length - 4)}</p>
                        </div>
                        :
                        <div className="flex items-center py-2 px-3 bg-white rounded-[12px] gap-0.5" onClick={open}>
                            <span className="flex"><WalletIcon/></span>
                            <p className="text-black text-[12px]" style={{lineHeight: "14px"}}>Connect wallet</p>
                        </div>
                }
            </Link>
        </header>
    )
}