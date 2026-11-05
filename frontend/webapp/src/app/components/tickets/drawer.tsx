'use client'

import React, {useState, useEffect} from 'react';
import Image from "next/image";
import {TicketSilverIcon} from "@/app/icons/ticketSilver";
import {TicketGoldIcon} from "@/app/icons/ticketGold";
import {WarningIcon} from "@/app/icons/warning";
import Link from "next/link";
import {useHeader} from "@/app/header/context";
import {buyTicket, getInvoiceLink} from "@/app/tickets/api";
import {TicketType} from "@/app/tickets/types";
import {useRouter} from "next/navigation";
import {Spin, message, ConfigProvider} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {language} from "@/app/language";
import {getSystemValue} from "@/app/api/system";
import {TrueIcon} from "@/app/icons/true";
import {StarIcon} from "@/app/icons/star";


interface Props {
    coin: TicketType;
    price: number;
}

export function DrawerTicket(props: Props) {
    const {coin, price} = props;
    const [value, setValue] = useState<number | undefined>(1)
    const {gold, silver, setGold, setSilver} = useHeader()
    const [viewWarning, setViewWarning] = useState<boolean>(price > (coin === "gold" ? gold : silver))
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [priceStars, setPriceStars] = useState<number>(0)
    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        getSystemValue("price_gold_ticket_stars").then(r => {
            setPriceStars(Number(r.value))
        })
    }, []);

    useEffect(() => {
        setViewWarning(price > (coin === "gold" ? gold : silver))
    }, [gold, silver]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        if (newValue.length > 1) return
        if (newValue == "") {
            setValue(undefined)
            setViewWarning(false)
        }
        else {
            const num = Number(newValue)
            if (num * price > (coin == "gold" ? gold : silver)) {
                setViewWarning(true)
            }
            else {
                setViewWarning(false)
            }
            setValue(num)
        }
    }
    const warning = () => {
        return (
            <div className="flex mt-2 w-full items-center justify-between py-2 px-3 text-[12px] bg-[#5C353E] rounded-xl">
                <div className="flex items-center gap-1">
                    <WarningIcon/>
                    <p>{language("Not enough coins")}</p>
                </div>
                {coin == "gold" ? <Link href={"/profile?swap=true"} className="underline">{language("Top up")}</Link> : <Link className="underline" href={"/tasks"}>{language("Complete the tasks")}</Link>}
            </div>
        )
    }

    const handleBuy = () => {
        setLoading(true)
        buyTicket(coin, value ? value : 1).then((r) => {
            if (r) {
                if (coin == "gold") {
                    setGold(gold - r.price)
                }
                else {
                    setSilver(silver - r.price)
                }
                router.push("/tickets")
            }
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

    const handleBuyStars = async () => {
        const lang = localStorage.getItem("language") as string
        Telegram.WebApp.openInvoice(await getInvoiceLink(value ? value : 1, lang), (status) => {
            if (status == "paid") {
                router.push("/tickets")
            }
            else if (status == "pending") {
                success(language("Please wait, the payment is still being processed"))
            }
        })
    }

    const [paddingBottom, setPaddingBottom] = useState<number>(28)
    return (
        <div
            style={{paddingBottom: `${paddingBottom}px`}}
            className='flex flex-col w-full pb-7 items-center px-7 pt-3 bg-gradient-to-b from-[#2c2a2a] to-[#373850] rounded-t-3xl text-white'>
            <ConfigProvider theme={{components: {Message: {contentBg: '#57586f', colorText: '#FFFFFF'}}}}>
                {contextHolder}
            </ConfigProvider>
            <span className='w-10 h-1 bg-[#555454] rounded-xl mb-5'></span>
            <p className="text-center text-[24px] mt-5" style={{lineHeight: "26px"}}>
                {language("Get")} {language(coin)} {language("ticket")}
            </p>
            <div
                className="relative flex w-full items-center justify-between gap-1 bg-[#39424C] rounded-2xl py-2 px-5 mt-5">
                <input
                    type={"number"}
                    className={`flex w-1/2 text-[36px] font-medium bg-transparent border-none focus:outline-none`}
                    style={{lineHeight: "36px", color: "white"}}
                    value={value}
                    placeholder={"1"}
                    onChange={handleChange}
                    onFocus={() => {
                        setPaddingBottom(prevState => prevState + 350)
                    }}
                    onBlur={() => {
                        setPaddingBottom(28)
                    }}
                />
                <div className="flex items-center gap-1 text-[18px]">
                    <span className="flex items-center gap-0.5">
                        <Image src={`/${coin}-coin.png`} alt="coin" width={22} height={22} className="-mt-0.5"/>
                        <p>{(value ? value : 1) * price}</p>
                    </span>
                    <p className="text-[#909097]">{coin == "gold" ? coin.toUpperCase() : "KAIFU"}</p>
                </div>
            </div>
            {viewWarning ? warning() : null}
            {value && !viewWarning ?
                <>
                    <button
                        className={`flex mt-5 gap-2 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] ${coin == "gold" ? "bg-[#FCB246] text-black" : "bg-gradient-to-r from-[#0D70F2] to-[#0DAEF2]"}`}
                        onClick={handleBuy}
                    >
                        {language("Get")} {value ? value : ''} {value <= 1 ? language('ticket') : language('ticket') == 'ticket' ? 'tickets' : value < 5 ? "билета" : "билетов"}
                        <span className="-mt-0.5">
                            {
                                !loading ? coin == "gold" ? <TicketGoldIcon color={"#000"}/> :
                                        <TicketSilverIcon color={"#FFF"}/>
                                    : <Spin indicator={<LoadingOutlined spin/>} size="small"/>
                            }
                        </span>
                    </button>
                </>
                :
                <button
                    className="flex mt-5 gap-2 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gray-600">
                    {language("Get ticket")}
                    <span className="-mt-0.5">
                        {coin == "gold" ? <TicketGoldIcon color={"#FFF"}/> : <TicketSilverIcon color={"#FFF"}/>}
                    </span>
                </button>
            }
            {coin == "gold" ?
                value ?
                    <button
                        className="flex mt-2 items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[14px] bg-gradient-to-r from-[#0D70F2] to-[#0DAEF2]"
                        onClick={handleBuyStars}
                    >
                        <p>{language("Buy for")} {priceStars * (value ? value : 1)}</p><p className="-mt-1"><StarIcon/></p>
                    </button>
                    :
                    <button
                        className={`flex mt-2 gap-2 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gray-600`}
                        onClick={handleBuyStars}
                    >
                        <p>{language("Buy for")} {priceStars * (value ? value : 1)}</p><p className="-mt-1"><StarIcon/></p>
                    </button>
                : null
            }
        </div>
    );
}