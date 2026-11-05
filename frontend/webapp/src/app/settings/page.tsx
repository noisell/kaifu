'use client'

import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import {useTelegram} from "@/app/telegram/context";
import {useNav} from "@/app/navigation/context";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {language} from "@/app/language";
import Link from "next/link";

export default function Page() {
    const router = useRouter()
    const { webApp, user } = useTelegram()
    const { setShowNavigation, setActiveButton } = useNav()

    useEffect(() => {
        if (webApp && user) {
            setShowNavigation(true)
            setActiveButton('/')
            const backButton = Telegram.WebApp.BackButton
            backButton.show()
            backButton.onClick(() => router.back())
            return () => {
                backButton.hide()
                backButton.offClick(() =>  router.back())
            }
        }
    }, [user]);

    const handleClick = () => {
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
        const userLang = localStorage.getItem("language")
        if (userLang == "en") {
            localStorage.setItem("language", "ru")
        }
        else {
            localStorage.setItem("language", "en")
        }
        router.refresh()
    }

    return (
        <main>
            <div className={"flex w-full items-center bg-[#21212C] rounded-2xl justify-between px-4 py-3 cursor-pointer"} onClick={handleClick}>
                <span className={"flex items-center gap-2"} style={{lineHeight: "15px", fontSize: "15px"}}><ExclamationCircleOutlined style={{marginTop: "-4px"}} /> <p>{language("Application language")}</p></span>
                <span className={"flex items-center gap-1"}>
                    <p className={"text-blue-400"}>{language("Application language") == "Application language" ? "English" : "Русский"}</p>
                </span>
            </div>
            <Link href={"https://mirry.ru/?ref=kaifu"} className={"w-full text-center text-xs mt-2 text-gray-600"}>Приложение разработанно и поддерживается в <p className={"text-blue-400"}>mirry dev</p></Link>
        </main>
    );
};