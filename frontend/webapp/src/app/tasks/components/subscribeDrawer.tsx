'use client'

import React, {useEffect, useState} from "react";
import { message, ConfigProvider, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import Image from "next/image";
import {getCloudStorageItem, removeCloudStorageItem, setCloudStorageItem} from "@/app/utils";
import {checkSubOther, checkSubTg} from "@/app/tasks/api";
import {CheckIcon} from "@/app/tasks/icons/check";
import {useHeader} from "@/app/header/context";
import {language} from "@/app/language";

interface Props {
    logo: React.ReactNode,
    name: string,
    price: number,
    keyCloud: string,
    setOpen: (open: boolean) => void,
}

export function SubscribeDrawer (props: Props) {
    const [valueCloud, setValueCloud] = useState<string>("")
    const [success, setSuccess] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage()
    const {silver, setSilver} = useHeader()
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [countdownFinished, setCountdownFinished] = useState(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false)

    useEffect(() => {
        getCloudStorageItem(props.keyCloud).then(value => setValueCloud(value ? value : ""));
    }, []);

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

    useEffect(() => {
        if (valueCloud === 'true') {
            const getInitialTime = () => {
                getCloudStorageItem(`${props.keyCloud}__${props.keyCloud}`).then(r => {
                    const storedDateStr = r
                    if (storedDateStr) {
                        const storedDate = new Date(storedDateStr);
                        const now = new Date();
                        const diff = now.getTime() - storedDate.getTime(); // разница в миллисекундах
                        const secondsLeft = Math.max(0, Math.floor((60000 - diff) / 1000)); // секунды до 60
                        setTimeLeft(secondsLeft);
                        if (secondsLeft === 0) setCountdownFinished(true)
                    }
                });

            };
            const intervalId = setInterval(async () => {
                if (!countdownFinished && timeLeft > 0) {
                    setTimeLeft(timeLeft - 1);
                }
                if (timeLeft === 0) {
                    clearInterval(intervalId)
                    setCountdownFinished(true);
                }
            }, 1000);

            getInitialTime();

            return () => {
                clearInterval(intervalId);
            }
        }
    }, [valueCloud, countdownFinished, timeLeft, props]);

    const handleClickCheck = () => {
        if (props.keyCloud === "taskTg") {
            checkSubTg().then(subscribed => {
                if (subscribed) {
                    removeCloudStorageItem(props.keyCloud).then();
                    setSuccess(true);
                    setSilver(silver + 1000);
                }
                else error(language("You didn't subscribe"));
            })
        }
        else {
            console.log("TL", timeLeft)
            if (timeLeft <= 60 && timeLeft >= 50) {
                return error(language("You didn't subscribe"))
            }
            else if (timeLeft < 50 && timeLeft >= 1) return setShowSpinner(true);
            checkSubOther(props.keyCloud === "taskX" ? "x" : props.keyCloud === "taskInst" ? "instagram" : "youtube").then()
            removeCloudStorageItem(props.keyCloud).then();
            setSuccess(true);
            setSilver(silver + 1000);
        }
        removeCloudStorageItem(`${props.keyCloud}__${props.keyCloud}`).then()
    }

    const handleClickSub = () => {
        setCloudStorageItem(props.keyCloud, "true").then()
        setCloudStorageItem(`${props.keyCloud}__${props.keyCloud}`, `${new Date().toString()}`).then()
        setValueCloud("true")
        if (props.keyCloud === "taskTg") {
            Telegram.WebApp.openLink(process.env.NEXT_PUBLIC_TG_CHANNEL_URL as string)
        }
        else if (props.keyCloud === "taskX") {
            Telegram.WebApp.openLink(process.env.NEXT_PUBLIC_X_CHANNEL_URL as string)
        }
        else if (props.keyCloud === "taskInst") {
            Telegram.WebApp.openLink(process.env.NEXT_PUBLIC_INST_CHANNEL_URL as string)
        }
        else {
            Telegram.WebApp.openLink(process.env.NEXT_PUBLIC_YT_CHANNEL_URL as string)
        }
    }

    const successSub = () => {
        return (
            <div
                className='flex flex-col w-full items-center px-7 pt-3 pb-7 bg-gradient-to-b from-[#2c2a2a] to-[#373850] rounded-t-3xl text-white'>
                <span className='w-10 h-1 bg-[#555454] rounded-xl mb-5'></span>
                <CheckIcon color={"green"} width={40} height={40}/>
                <p className="text-center text-[32px] mt-5" style={{lineHeight: "38px"}}>{language("Success")}</p>
                <p className="text-[14px] text-[#909097] mt-2 text-center">{language("Your reward has been added to your balance")}</p>
                <div
                    className="flex items-center py-3 px-4 bg-gradient-to-b from-[#343235] to-[#3d3d51] rounded-3xl mt-4 gap-1">
                    <Image src={"/silver-coin.png"} alt={"coin"} width={50} height={50}/>
                    <p className="font-bold text-[36px]">+1000</p>
                </div>
                <button className="flex mt-4 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-white text-black" onClick={() => props.setOpen(false)}>Ok</button>
            </div>
        )
    }

    return (
        success ? successSub() :
        <div
            className='flex flex-col w-full items-center px-7 pt-3 pb-7 bg-gradient-to-b from-[#2c2a2a] to-[#373850] rounded-t-3xl text-white'>
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
            <span className='w-10 h-1 bg-[#555454] rounded-xl mb-5'></span>
            {props.logo}
            <p className="text-center text-[32px] mt-5" style={{lineHeight: "38px"}}>
                {language("Subscribe")}<br/>{props.name}
            </p>
            <p className="text-[14px] text-[#909097] mt-2">{language("And get")}</p>
            <div className="flex flex-col items-center py-9 px-14 bg-gradient-to-b from-[#343235] to-[#3d3d51] rounded-3xl mt-4">
                <Image src={"/silver-coin.png"} alt={"coin"} width={140} height={140} />
                <p className="font-bold text-[36px] -ml-4">+1000</p>
            </div>
            {valueCloud === 'true' ?
                !showSpinner ?
                    <button className="flex mt-4 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-white text-black cursor-pointer" onClick={handleClickCheck}>
                        {language("Check")}
                    </button>
                    :
                    timeLeft != 0 ?
                        <button
                            className="flex mt-4 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gray-600 text-white cursor-pointer"
                        >
                            <span className={"flex gap-2 items-center -ml-5"}><Spin style={{color: "white"}} indicator={<LoadingOutlined spin/>} size="small"/> {language("Checking")}</span>
                        </button>
                        :
                        <button
                            className="flex mt-4 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-white text-black cursor-pointer"
                            onClick={handleClickCheck}
                        >
                            {language("Claim")}
                        </button>
                :
                <button
                    className="flex mt-4 items-center cursor-pointer justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gradient-to-r from-[#0D70F2] to-[#0DAEF2]"
                    onClick={handleClickSub}
                >
                    {language("Subscribe") == "Subscribe" ? "Subscribe" : "Подписаться"}
                </button>
            }
        </div>
    )
}