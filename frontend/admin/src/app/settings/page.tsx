'use client'
import React, {useState, useEffect, ChangeEvent} from 'react';
import {System, SystemNames, SystemNames2} from "@/app/settings/types";
import {changeSettings, getSettings} from "@/app/settings/api";
import {LoadingItem} from "@/app/components/loading";
import {useNav} from "@/app/navigation/context";
import {ConfigProvider, Input, message} from "antd";
import {success} from "@/app/utils";

const transcription: Record<SystemNames, string> = {
    course: "Курс GOLD к TON",
    price_gold_ticket: "Цена золотого билета в GOLD",
    price_silver_ticket: "Цена серебрянного билета в KAIFU",
    wallet: "Адрес TON кошелька",
    today: "Передичность ежедневных розыгрышей (сек)",
    course_stars: "Курс GOLD к STARS",
    price_gold_ticket_stars: "Цена золотого билета в STARS",
    stars: "Баланс STARS",
    investment_silver: "",
    investment_gold: "",
    investment_gold_jackpot: "",
    investment_silver_jackpot: ""
}
const listNames2 = ["count_first", "percent_first", "count_second", "percent_second", "count_third", "percent_third"]

export default function PageSettings() {
    const [data, setData] = useState<System[]>([]);
    const [loading, setLoading] = useState(false);
    const {setShowNavigation, setActive} = useNav()
    const [messageApi, contextHolder] = message.useMessage()
    useEffect(() => {
        getSettings().then(r => {
            setData(r);
            setLoading(true);
            setShowNavigation(true);
            setActive("/settings")
        })
    }, []);
    const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        setData(prevState => {
            return prevState.map((item => (item.name == name ? {...item, value: e.target.value} : item)))
        })
    }

    const handleBlur = (name: SystemNames | SystemNames2) => {
        changeSettings(name, data.find((item) => item.name == name)?.value as string).then(_ => {
            success(messageApi, "Успешно обновлено!")
        });
    }

    return (
        loading ?
            <div className="section flex-col">
                <ConfigProvider theme={{components: {Message: {contentBg: '#F2F2F2', colorText: '#141414'}}}}>
                    {contextHolder}
                </ConfigProvider>
                <h1 className={"text-[32px] mb-10 ml-2"}>Найстройка динамичных данных</h1>
                <div className={"flex flex-wrap gap-2"}>
                    {data.length > 0 && data.map((item, index) => !listNames2.includes(item.name) && item.name != "stars" && item.name != "today" && item.name != "investment_silver" && item.name != "investment_gold" && item.name != "investment_silver_jackpot" && item.name != "investment_gold_jackpot" && (
                        <div key={index} className={`flex flex-col w-[48%] gap-2 mb-3`}>
                            <p className="text-[22px] ml-2 text-[#494747]">{transcription[item.name as SystemNames]}</p>
                            <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}} size={"large"}
                                   placeholder="Данные" value={item.value} onChange={(e) => handleChange(e, item.name)}
                                   onBlur={() => {
                                       handleBlur(item.name)
                                   }}/>
                        </div>
                    ))}
                </div>
                <h1 className={"text-[32px] mt-10 ml-2"}>Ежедневные розыгрыши</h1>
                <div className={"flex flex-col gap-2 w-full mt-3"}>
                    <div className={"flex items-center w-full gap-2"}>
                        <span
                            className="flex items-center px-4 text-nowrap font-medium text-[23px] h-[70px] bg-[#CCCCCC] rounded-[18px]">1 место</span>
                        <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}} size={"large"}
                               prefix={"чел."}
                               placeholder="Данные" value={data.find((item) => item.name == "count_first")?.value}
                               onChange={(e) => handleChange(e, data.find((item) => item.name == "count_first")?.name as string)}
                               onBlur={() => {
                                   handleBlur(data.find((item) => item.name == "count_first")?.name as SystemNames2)
                               }}/>
                        <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}} size={"large"}
                               prefix={"%"}
                               placeholder="Данные" value={data.find((item) => item.name == "percent_first")?.value}
                               onChange={(e) => handleChange(e, data.find((item) => item.name == "percent_first")?.name as string)}
                               onBlur={() => {
                                   handleBlur(data.find((item) => item.name == "percent_first")?.name as SystemNames2)
                               }}/>
                    </div>
                    <div className={"flex items-center w-full gap-2"}>
                        <span
                            className="flex items-center px-4 text-nowrap font-medium text-[23px] h-[70px] bg-[#CCCCCC] rounded-[18px]">2 место</span>
                        <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}} size={"large"}
                               prefix={"чел."}
                               placeholder="Данные" value={data.find((item) => item.name == "count_second")?.value}
                               onChange={(e) => handleChange(e, data.find((item) => item.name == "count_second")?.name as string)}
                               onBlur={() => {
                                   handleBlur(data.find((item) => item.name == "count_second")?.name as SystemNames2)
                               }}/>
                        <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}} size={"large"}
                               prefix={"%"}
                               placeholder="Данные" value={data.find((item) => item.name == "percent_second")?.value}
                               onChange={(e) => handleChange(e, data.find((item) => item.name == "percent_second")?.name as string)}
                               onBlur={() => {
                                   handleBlur(data.find((item) => item.name == "percent_second")?.name as SystemNames2)
                               }}/>
                    </div>
                    <div className={"flex items-center w-full gap-2 mb-10"}>
                        <span
                            className="flex items-center px-4 text-nowrap font-medium text-[23px] h-[70px] bg-[#CCCCCC] rounded-[18px]">3 место</span>
                        <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}} size={"large"}
                               prefix={"чел."}
                               placeholder="Данные" value={data.find((item) => item.name == "count_third")?.value}
                               onChange={(e) => handleChange(e, data.find((item) => item.name == "count_third")?.name as string)}
                               onBlur={() => {
                                   handleBlur(data.find((item) => item.name == "count_third")?.name as SystemNames2)
                               }}/>
                        <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}} size={"large"}
                               prefix={"%"}
                               placeholder="Данные" value={data.find((item) => item.name == "percent_third")?.value}
                               onChange={(e) => handleChange(e, data.find((item) => item.name == "percent_third")?.name as string)}
                               onBlur={() => {
                                   handleBlur(data.find((item) => item.name == "percent_third")?.name as SystemNames2)
                               }}/>
                    </div>
                </div>
            </div>
            :
            <LoadingItem/>
    );
};