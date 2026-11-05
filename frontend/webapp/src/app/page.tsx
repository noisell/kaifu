'use client'

import React, {useEffect, useState} from "react";
import {useNav} from "@/app/navigation/context";
import {Invite} from "@/app/components/invite/invite";
import {authorization} from "@/app/api";
import {useTelegram} from "@/app/telegram/context";
import {parseReferrerID} from "@/app/utils";
import {LoadingComponent} from "@/app/components/loading";
import {useHeader} from "@/app/header/context";
import {Gold} from "@/app/components/tickets/gold";
import {Silver} from "@/app/components/tickets/silver";
import {Pool} from "@/app/components/pool";
import {getCountTicketsWon, getPricePool} from "@/app/tickets/api";
import {NewUser} from "@/app/components/newUser";

export default function Home() {
    const { setActiveButton, setShowNavigation, setCountWon } = useNav()
    const { webApp, user } = useTelegram()
    const { priceGold, priceSilver } = useHeader()
    const [today, setToday] = useState<number>(0)
    const [jackpot, setJackpot] = useState<number>(0)
    const [newUser, setNewUser] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (webApp && user) {
            console.log("BOT:", Telegram.WebApp.initDataUnsafe.user)
            const userLang = localStorage.getItem("language")
            if (!userLang) {
                localStorage.setItem("language", user.language_code)
            }
            const popupClosed = (eventData: { button_id: string | null }) => {
                if (eventData.button_id === 'closeWebApp') {
                    Telegram.WebApp.close()
                }
            }

            let referrerID = null
            const start_param = Telegram.WebApp.initDataUnsafe.start_param
            if (start_param != undefined) {
                referrerID = parseReferrerID(start_param)
            }
            authorization(
                {user_id: user.id, username: user.username, initData: webApp.initData, avatar: Telegram.WebApp.initDataUnsafe.user?.photo_url}, referrerID
            ).then(r => {
                if (r.status) {
                    if (r.newUser) {
                        setIsLoading(true)
                        return setNewUser(true)
                    }
                    else {
                        getPricePool().then((r) => {
                            setToday(r.today)
                            setJackpot(r.jackpot)
                            setShowNavigation(true)
                            setActiveButton('/')
                            getCountTicketsWon().then(res => {setCountWon(res)})
                            setIsLoading(true)
                        })
                    }
                }
            })
            Telegram.WebApp.onEvent('popupClosed', popupClosed)
            return () => {
                Telegram.WebApp.offEvent('popupClosed', popupClosed)
            }
        }
    }, [user])

    return (
        isLoading ?
            newUser
                ?
                <NewUser/>
                :
                <main>
                    <Pool today={today} jackpot={jackpot}/>
                    <Gold price={priceGold}/>
                    <Silver price={priceSilver}/>
                    <Invite/>
                </main>
            :
            <LoadingComponent/>
    );
}
