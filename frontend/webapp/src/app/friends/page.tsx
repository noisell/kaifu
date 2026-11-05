'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { Invite } from "@/app/components/invite/invite";
import { CopyIcon } from "@/app/friends/icons/copy";
import { message, ConfigProvider } from 'antd'
import {TrueIcon} from "@/app/icons/true";
import {useTelegram} from "@/app/telegram/context";
import {useNav} from "@/app/navigation/context";
import {FriendType} from "@/app/friends/types";
import {Friend} from "@/app/friends/components/friend";
import {getFriends} from "@/app/friends/api";
import {language} from "@/app/language";
import {getCountTicketsWon} from "@/app/tickets/api";

export default function Friends() {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage()
    const { webApp, user } = useTelegram()
    const { setActiveButton, setShowNavigation, setCountWon } = useNav()
    const [refURL, setRefURL] = useState<string>('');
    const [friends, setFriends] = useState<FriendType[]>([]);
    const [loading, setLoading] = useState<boolean>(true)

    const text = `\n${language("Join KAIFU!")}\n\n🎟️ ${language("Participate in the sweepstakes and win every day.")}\n🤝 ${language("Invite your friends and get 20% off their tickets and winnings.")}\n💰 ${language("Exchange rewards for TON instantly!")}\n\n👉 ${language("Start the game right now!")}\n🌐 ${refURL}\n\n${language("Become a part of KAIFU and start earning!")}`

    const error = (text: string) => {
        messageApi
            .open({
                type: 'error',
                content: text
            })
            .then(() => {
                return
            })
    }
    const success = (text: string) => {
        messageApi
            .open({
                type: 'success',
                content: text,
                icon: <span className="px-1"><TrueIcon/></span>,

            })
            .then(() => {
                return
            })
    }
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(refURL)
            success(language("Link copied to clipboard"))
        } catch (er) {
            error(language("Link don`t copied to clipboard"))
        }
    }
    useEffect(() => {
        getFriends().then(
            r => {
                setFriends(r)
                setLoading(false)
            }
        )
        getCountTicketsWon().then(r => {setCountWon(r)})
    }, []);

    useEffect(() => {
        if (webApp && user) {
            setRefURL(`${process.env.NEXT_PUBLIC_BOT_URL}?startapp=friend${user.id}`)
            const backButton = Telegram.WebApp.BackButton
            const popupClosed = (eventData: { button_id: string | null }) => {
                if (eventData.button_id === 'closeWebApp') {
                    Telegram.WebApp.close()
                }
            }
            setShowNavigation(true)
            setActiveButton('/friends')
            backButton.show()
            backButton.onClick(() => router.back())
            Telegram.WebApp.onEvent('popupClosed', popupClosed)
            return () => {
                backButton.hide()
                backButton.offClick(() => router.back())
                Telegram.WebApp.offEvent('popupClosed', popupClosed)
            }
        }
    }, [user]);
    return (
        <main>
            <ConfigProvider
                theme={{
                    components: {
                        Message: {
                            contentBg: '#57586f',
                            colorText: '#FFFFFF',
                        },
                    },
                }}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex flex-col w-full items-center px-2 gap-1 mb-3">
                <p className="text-2xl text-center">
                    {language("Invite your friends and win with them")}
                </p>
                <p className="text-[14px] text-center">
                    {language("Get 20% off your friend's ticket at once")}
                </p>
            </div>
            <Invite/>
            <div className="flex items-center w-full mt-5 gap-1">
                <button className="flex items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gradient-to-r from-[#0D70F2] to-[#0DAEF2]"
                        onClick={() => {
                            Telegram.WebApp.openTelegramLink(
                                `https://t.me/share/url?url=${refURL}&text=${encodeURIComponent(text)}`,
                            )
                        }}
                >
                    {language("Invite Friends")}
                </button>
                <button className="flex items-center justify-center p-3.5 bg-[#323030] rounded-2xl"
                        onClick={handleCopy}
                >
                    <CopyIcon/>
                </button>
            </div>
            <div className="flex w-full flex-col gap-2 items-start mt-5">
                <p className="text-[16px]">Friends</p>
                <div className="flex w-full flex-col gap-2 items-center">
                    {
                        loading ?
                            <p className="text-[16px] text-[#909097]">{language("Loading...")}</p>
                            :
                            friends.length > 0 ?
                                friends.map((friend, index) => (
                                    <Friend username={friend.username} avatar={friend.avatar} goldCoins={friend.gold_coins} key={index}/>
                                    )
                                )
                                :
                                <p className="text-[16px] text-[#909097]">{language("You don't have any referrals")}</p>
                    }
                </div>
            </div>
        </main>
    )
}