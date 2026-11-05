'use client'

import {SwapIcon} from "@/app/profile/icons/swap";
import React, {useState, useEffect} from "react";
import {useHeader} from "@/app/header/context";
import { message, ConfigProvider } from 'antd'
import {SwapElement} from "@/app/profile/components/swapElement";
import {SendTransactionRequest, useTonAddress, useTonConnectUI} from "@tonconnect/ui-react";
import {TrueIcon} from "@/app/icons/true";
import {getSystemValue} from "@/app/api/system";
import {updateHistory} from "@/app/profile/api";
import {language} from "@/app/language";

interface Props {
    course: number,
    priceGoldTicket: number,
}

export function Swap (props: Props) {
    const { course, priceGoldTicket } = props
    const { gold, setGold } = useHeader()
    const [swap, setSwap] = useState<"gold" | "ton">("ton")
    const [goldValue, setGoldValue] = useState<number | undefined>(undefined)
    const [tonValue, setTonValue] = useState<number | undefined>((goldValue ? goldValue : 0) * course)
    const [goldColor, setGoldColor] = useState<"white" | "red">(gold >= (goldValue ? goldValue : 0) ? "white" : "red")
    const [tonConnectUI] = useTonConnectUI()
    const address = useTonAddress();
    const [messageApi, contextHolder] = message.useMessage()

    const handleGoldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (/^\d+$/.test(newValue)) {
            const trimmedValue = newValue.replace(/^0+/, '');
            const goldAmount = trimmedValue === '' ? 0 : Number(trimmedValue);
            if (gold >= goldAmount) {
                setGoldColor("white")
            }
            else {
                swap === "gold" && Telegram.WebApp.HapticFeedback.notificationOccurred('error')
                setGoldColor("red")
            }
            setGoldValue(goldAmount);
            setTonValue(Number((goldAmount * course).toFixed(2)));
        }
        else if (/^\d+(\.\d+)?$/.test(newValue)) {
            const goldAmount = Math.round(Number(newValue));
            if (gold >= goldAmount) {
                setGoldColor("white")
            }
            else {
                swap === "gold" && Telegram.WebApp.HapticFeedback.notificationOccurred('error')
                setGoldColor("red")
            }
            setGoldValue(goldAmount);
            setTonValue(goldAmount * course);
        }
        else if (newValue === "") {
            setGoldValue(undefined)
            setGoldColor("white")
            setTonValue(0)
        }
    }

    const handleTonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue.slice(-1) === ".") {
            const tonAmount = Number(tonValue?.toFixed(0));
            setTonValue(tonAmount);
            const newGoldValue = tonAmount * Number((1 / course).toFixed(2))
            if (gold >= newGoldValue) {
                setGoldColor("white")
            }
            else {
                swap === "gold" && Telegram.WebApp.HapticFeedback.notificationOccurred('error')
                setGoldColor("red")
            }
            setGoldValue(newGoldValue);
        }
        else if (/^\d+(\.\d+)?$/.test(newValue)) {
            const trimmedValue = newValue.replace(/^0+/, '');
            const tonAmount = trimmedValue === '' ? 0 : Number(trimmedValue);
            setTonValue(tonAmount);
            const newGoldValue = swap == "gold" ? Math.ceil(tonAmount * Number((1 / course).toFixed(2))) : Math.round(tonAmount * Number((1 / course).toFixed(2)))
            if (gold >= newGoldValue) {
                setGoldColor("white")
            }
            else {
                swap === "gold" && Telegram.WebApp.HapticFeedback.notificationOccurred('error')
                setGoldColor("red")
            }
            setGoldValue(newGoldValue);
        }
        else if (newValue === "") {
            setTonValue(undefined)
            setGoldValue(0)
        }
    }
    const error = (text: string) => {
        messageApi
            .open({
                type: 'error',
                content: text
            })
            .then(() => {})
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
    const handleClick = async () => {
        if (!tonConnectUI.connected) {
            return error(language("Please connect your wallet"))
        }
        if (swap == "ton" && tonValue && goldValue) {
            if (tonValue < 1) {
                return error(language("The minimum amount is 1 Ton"))
            }
            let wallet = (await getSystemValue("wallet")).value;
            const transaction: SendTransactionRequest = {
                validUntil: Date.now() + 5 * 60 * 1000,
                messages: [
                    {
                        address: wallet,
                        amount: Math.ceil(tonValue * 10 ** 9).toString()
                    }
                ]
            }
            try {
                await tonConnectUI.sendTransaction(transaction)
                setGold(gold + goldValue)
                updateHistory({type: "top_up", amount: tonValue, gold: goldValue, system_wallet: wallet, user_wallet: address}).then()
                return success(`Successfully! ${goldValue} GOLD were credited`)
            } catch {
                return error(language("Please try again later"))
            }
        }
        if (swap == "gold" && tonValue && goldValue) {
            if (goldValue > gold) {
                return error(language("Insufficient funds"))
            }
            else if (tonValue < 3) {
                return error(language("The minimum amount is 3 Ton"))
            }
            updateHistory({type: "withdraw", amount: tonValue, gold: goldValue, system_wallet: null, user_wallet: address}).then(
                result => {
                    if (result) {
                        setGold(gold - goldValue)
                        return success(language("The request was successfully created"))
                    }
                }
            )
        }
        setTonValue(0)
        setGoldValue(0)

    }
    return (
        <div className="flex flex-col w-full gap-3">
            <ConfigProvider theme={{components: {Message: {contentBg: '#57586f', colorText: '#FFFFFF'}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="relative flex flex-col w-full ">
                {swap === "gold" ?
                    <div className="flex flex-col w-full gap-1">
                        <SwapElement type={"pay"} coin={"gold"} color={goldColor} value={goldValue} onChange={handleGoldChange}
                                     footer={`1 GOLD ≈ ${course} TON`}/>
                        <SwapElement type={"receive"} coin={"ton"} color={"white"} value={tonValue} onChange={handleTonChange}
                                     footer={`≈ ${tonValue ? (tonValue * 520).toFixed(2) : 0} RUB`}/>
                    </div> :
                    <div className="flex flex-col w-full gap-1">
                        <SwapElement type={"pay"} coin={"ton"} color={"white"} value={tonValue} onChange={handleTonChange}
                                     footer={`1 TON ≈ ${(1 / course).toFixed(2)} GOLD`}/>
                        <SwapElement type={"receive"} coin={"gold"} color={"white"} value={goldValue} onChange={handleGoldChange}
                                     footer={`= ${goldValue ? Math.floor(goldValue / priceGoldTicket) : 0} ${language("Tickets")}`}/>
                    </div>
                }
                <div className="absolute cursor-pointer flex items-center justify-center w-[44px] h-[44px] bg-[#3c3a3a] rounded-full swap border-4 border-[#1b1919]"
                     onClick={() => setSwap(swap === "gold" ? "ton" : "gold")}>
                    <SwapIcon/>
                </div>
            </div>
            <button
                onClick={handleClick}
                className={`flex w-full items-center justify-center text-[14px] rounded-2xl ${(goldValue && goldColor === "white") || (swap == "ton" && goldValue && goldValue > 0) ? 'bg-[#0a8ff2]' : "bg-gray-600 cursor-not-allowed"} py-3`}>
                {language("Swap")}
            </button>
        </div>
    )
}