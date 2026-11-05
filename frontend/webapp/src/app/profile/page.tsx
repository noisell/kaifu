'use client'

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useHeader} from "@/app/header/context";
import {useTelegram} from "@/app/telegram/context";
import {useNav} from "@/app/navigation/context";
import {Swap} from "@/app/profile/components/swap";
import {HistorySection} from "@/app/profile/components/historySection";
import {WalletSection} from "@/app/profile/components/walletSection";
import {language} from "@/app/language";
import {getCountTicketsWon} from "@/app/tickets/api";

export default function Profile () {
    const router = useRouter()
    const { webApp, user } = useTelegram()
    const { course, priceGold } = useHeader()
    const { setShowNavigation, setActiveButton, setCountWon } = useNav()

    const [buttonActive, setButtonActive] = useState<'wallet' | 'swap' | 'history'>('swap')

    useEffect(() => {
        if (webApp && user) {
            getCountTicketsWon().then(r => {setCountWon(r)})
            const popupClosed = (eventData: { button_id: string | null }) => {
                if (eventData.button_id === 'closeWebApp') {
                    Telegram.WebApp.close()
                }
            }
            setShowNavigation(true)
            setActiveButton('/')
            const backButton = Telegram.WebApp.BackButton
            backButton.show()
            backButton.onClick(() => router.back())
            Telegram.WebApp.onEvent('popupClosed', popupClosed)
            return () => {
                backButton.hide()
                backButton.offClick(() =>  router.back())
                Telegram.WebApp.offEvent('popupClosed', popupClosed)
            }
        }
    }, [user]);


    return (
        <main>
            <div
                className="flex w-full mb-3 max-w-[99%] items-center bg-[#35333a] justify-center rounded-2xl text-[#909097] text-[14px]">
                <button
                    className={`flex w-full max-w-[33%] items-center justify-center py-2 rounded-2xl ${buttonActive == 'wallet' && 'bg-[#48474e] text-white'}`}
                    onClick={() => {
                        Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                        setButtonActive('wallet')
                    }}
                >
                    {language("Wallet")}
                </button>
                <button
                    className={`flex w-full max-w-[33%] items-center justify-center py-2 rounded-2xl ${buttonActive == 'swap' && 'bg-[#48474e] text-white'}`}
                    onClick={() => {
                        Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                        setButtonActive('swap')
                    }}
                >
                    {language("Swap")}
                </button>
                <button
                    className={`flex w-full max-w-[33%] items-center justify-center py-2 rounded-2xl ${buttonActive == 'history' && 'bg-[#48474e] text-white'}`}
                    onClick={() => {
                        Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                        setButtonActive('history')
                    }}
                >
                    {language("History")}
                </button>
            </div>
            {buttonActive == 'wallet' ? <WalletSection/> : buttonActive == 'swap' ? <Swap course={course} priceGoldTicket={priceGold}/> : <HistorySection/>}
        </main>
    )
}