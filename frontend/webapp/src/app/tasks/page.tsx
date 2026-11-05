'use client'
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {ArrowRightIcon} from "@/app/icons/arrowRight";
import {TelegramIcon} from "@/app/tasks/icons/telegram";
import {XIcon} from "@/app/tasks/icons/x";
import {YouTubeIcon} from "@/app/tasks/icons/youtube";
import {Drawer} from "@/app/components/drawer";
import {SubscribeDrawer} from "@/app/tasks/components/subscribeDrawer";
import {getTasks} from "@/app/tasks/api";
import {CheckIcon} from "@/app/tasks/icons/check";
import {getCloudStorageItem} from "@/app/utils";
import {useNav} from "@/app/navigation/context";
import {useTelegram} from "@/app/telegram/context";
import {language} from "@/app/language";
import {InstIcon} from "@/app/tasks/icons/inst";
import {getCountTicketsWon} from "@/app/tickets/api";

import {TeamOutlined} from "@ant-design/icons";
import {getFriends} from "@/app/friends/api";
import Link from "next/link";

interface Drawers {
    telegram: boolean
    x: boolean
    youtube: boolean
    instagram: boolean
}

export default function Tasks() {
    const router = useRouter();
    const { webApp, user } = useTelegram()
    const { setActiveButton, setShowNavigation, setCountWon } = useNav()
    const [open, setOpen] = useState<Drawers>({telegram: false, x: false, youtube: false, instagram: false})

    const [tgCompleted, setTgtCompleted] = useState<boolean>(false)
    const [xCompleted, setXCompleted] = useState<boolean>(false)
    const [ytCompleted, setYtCompleted] = useState<boolean>(false)
    const [instCompleted, setInstCompleted] = useState<boolean>(false)

    const [taskTg, setTaskTg] = useState<string>("")
    const [taskX, setTaskX] = useState<string>("")
    const [taskYt, setTaskYt] = useState<string>("")
    const [taskInst, setTaskInst] = useState<string>("")
    const [countFriend, setCountFriend] = useState<number>(0)

    useEffect(() => {
        if (webApp && user) {
            getCountTicketsWon().then(r => {setCountWon(r)})
            const popupClosed = (eventData: { button_id: string | null }) => {
                if (eventData.button_id === 'closeWebApp') {
                    Telegram.WebApp.close()
                }
            }
            setShowNavigation(true)
            setActiveButton('/tasks')

            getCloudStorageItem("taskTg").then(value => setTaskTg(value ? value : ""));
            getCloudStorageItem("taskX").then(value => setTaskX(value ? value : ""));
            getCloudStorageItem("taskYt").then(value => setTaskYt(value ? value : ""));
            getCloudStorageItem("taskInst").then(value => setTaskInst(value ? value : ""));
            getTasks().then(
                r => {
                    setTgtCompleted(r.sub_tg)
                    setXCompleted(r.sub_x)
                    setYtCompleted(r.sub_yt)
                    setInstCompleted(r.sub_inst)
                }
            )
            getFriends().then(r => {
                setCountFriend(r.length)
            })
            const backButton = Telegram.WebApp.BackButton
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
    const setOpenTg = (open: boolean) => {
        setOpen(prevState => ({...prevState, telegram: open}))
    }
    const setOpenX = (open: boolean) => {
        setOpen(prevState => ({...prevState, x: open}))
    }
    const setOpenYt = (open: boolean) => {
        setOpen(prevState => ({...prevState, youtube: open}))
    }
    const setOpenInst = (open: boolean) => {
        setOpen(prevState => ({...prevState, instagram: open}))
    }
    return (
        <main>
            <div className="flex flex-col w-full gap-1">
                <div
                    className={`flex w-full px-4 py-4 bg-[#262525] rounded-2xl items-center justify-between cursor-pointer`}
                    onClick={() => {
                        if (!tgCompleted || taskTg === "true") {
                            setOpen(prevState => ({...prevState, telegram: !prevState.telegram}))
                        } else {
                            Telegram.WebApp.openTelegramLink(process.env.NEXT_PUBLIC_TG_CHANNEL_URL as string)
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center p-2 bg-[#39383b] rounded-xl">
                            <TelegramIcon/>
                        </div>
                        <div className="flex flex-col items-start gap-1 text-[16px]">
                            <p style={{lineHeight: "16px"}}>{language("Subscribe")} {language("Telegram")}</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Image src={"/silver-coin.png"} alt="coin" width={22} height={22}/>
                                    <p className="font-medium">1000</p>
                                </div>
                                <p style={{lineHeight: "16px"}} className="text-[#909097]">KAIFU</p>
                            </div>
                        </div>
                    </div>
                    {!tgCompleted || taskTg === "true" ? <ArrowRightIcon/> : <CheckIcon/>}
                </div>
                <div
                    className={`flex w-full px-4 py-4 bg-[#262525] rounded-2xl items-center justify-between cursor-pointer`}
                    onClick={() => {
                        if (!xCompleted || taskX === "true") {
                            setOpen(prevState => ({...prevState, x: !prevState.x}))
                        } else {
                            Telegram.WebApp.openLink(process.env.NEXT_PUBLIC_X_CHANNEL_URL as string)
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center justify-center p-2 min-w-[48px] min-h-[48px] bg-[#39383b] rounded-xl">
                            <XIcon/>
                        </div>
                        <div className="flex flex-col items-start gap-1 text-[16px]">
                            <p style={{lineHeight: "16px"}}>{language("Subscribe")} {language("X")}</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Image src={"/silver-coin.png"} alt="coin" width={22} height={22}/>
                                    <p className="font-medium">1000</p>
                                </div>
                                <p style={{lineHeight: "16px"}} className="text-[#909097]">KAIFU</p>
                            </div>
                        </div>
                    </div>
                    {!xCompleted || taskX === "true" ? <ArrowRightIcon/> : <CheckIcon/>}
                </div>
                <div
                    className={`flex w-full px-4 py-4 bg-[#262525] rounded-2xl items-center justify-between cursor-pointer`}
                    onClick={() => {
                        if (!ytCompleted || taskYt === "true") {
                            setOpen(prevState => ({...prevState, youtube: !prevState.youtube}))
                        } else {
                            Telegram.WebApp.openLink(process.env.NEXT_PUBLIC_YT_CHANNEL_URL as string)
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center p-2 bg-[#39383b] rounded-xl">
                            <YouTubeIcon/>
                        </div>
                        <div className="flex flex-col items-start gap-1 text-[16px]">
                            <p style={{lineHeight: "16px"}}>{language("Subscribe")} {language("YouTube")}</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Image src={"/silver-coin.png"} alt="coin" width={22} height={22}/>
                                    <p className="font-medium">1000</p>
                                </div>
                                <p style={{lineHeight: "16px"}} className="text-[#909097]">KAIFU</p>
                            </div>
                        </div>
                    </div>
                    {!ytCompleted || taskYt === "true" ? <ArrowRightIcon/> : <CheckIcon/>}
                </div>
                <div
                    className={`flex w-full px-4 py-4 bg-[#262525] rounded-2xl items-center justify-between cursor-pointer`}
                    onClick={() => {
                        if (!instCompleted || taskInst === "true") {
                            setOpen(prevState => ({...prevState, instagram: !prevState.instagram}))
                        } else {
                            Telegram.WebApp.openLink(process.env.NEXT_PUBLIC_INST_CHANNEL_URL as string)
                        }
                    }}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center p-2 bg-[#39383b] rounded-xl">
                            <InstIcon/>
                        </div>
                        <div className="flex flex-col items-start gap-1 text-[16px]">
                            <p style={{lineHeight: "16px"}}>{language("Subscribe")} {language("Instagram")}</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Image src={"/silver-coin.png"} alt="coin" width={22} height={22}/>
                                    <p className="font-medium">1000</p>
                                </div>
                                <p style={{lineHeight: "16px"}} className="text-[#909097]">KAIFU</p>
                            </div>
                        </div>
                    </div>
                    {!instCompleted || taskInst === "true" ? <ArrowRightIcon/> : <CheckIcon/>}
                </div>
                <Link href={"/friends"} className={`flex w-full px-4 py-4 bg-[#262525] rounded-2xl items-center justify-between cursor-pointer`}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center p-2 bg-[#39383b] rounded-xl">
                            <TeamOutlined style={{fontSize: "32px"}} />
                        </div>
                        <div className="flex flex-col items-start gap-1 text-[16px]">
                            <p style={{lineHeight: "16px"}}>{language("Invite 3 friends")}</p>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Image src={"/silver-coin.png"} alt="coin" width={22} height={22}/>
                                    <p className="font-medium">3000</p>
                                </div>
                                <p style={{lineHeight: "16px"}} className="text-[#909097]">KAIFU</p>
                            </div>
                        </div>
                    </div>
                    {countFriend >= 3 ? <CheckIcon/> : `${countFriend}/3`}
                </Link>
            </div>
            <Drawer
                open={open.telegram}
                setOpen={setOpenTg}
                content={<SubscribeDrawer setOpen={(open: boolean) => {
                    setOpenTg(open)
                    setTgtCompleted(true)
                    setTaskTg("")
                }} logo={<TelegramIcon width={42} height={42}/>} name={"Telegram"} price={1000} keyCloud={"taskTg"}/>}
            />
            <Drawer
                open={open.x}
                setOpen={setOpenX}
                content={<SubscribeDrawer setOpen={(open: boolean) => {
                    setOpenX(open)
                    setXCompleted(true)
                    setTaskX("")
                }} logo={<XIcon width={42} height={39}/>} name={"X"} price={1000} keyCloud={"taskX"}/>}
            />
            <Drawer
                open={open.youtube}
                setOpen={setOpenYt}
                content={<SubscribeDrawer setOpen={(open: boolean) => {
                    setOpenYt(open)
                    setYtCompleted(true)
                    setTaskYt("")
                }} logo={<YouTubeIcon width={42} height={42}/>} name={"YouTube"} price={1000} keyCloud={"taskYt"}/>}
            />
            <Drawer
                open={open.instagram}
                setOpen={setOpenInst}
                content={<SubscribeDrawer setOpen={(open: boolean) => {
                    setOpenInst(open)
                    setInstCompleted(true)
                    setTaskInst("")
                }} logo={<InstIcon width={42} height={42}/>} name={"Instagram"} price={1000} keyCloud={"taskInst"}/>}
            />
        </main>
    )
}