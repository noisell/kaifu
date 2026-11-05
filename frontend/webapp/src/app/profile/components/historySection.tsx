'use client'

import React, {useState, useEffect} from 'react';
import {History} from "@/app/profile/types";
import {getHistory} from "@/app/profile/api";
import {HistoryItem} from "@/app/profile/components/historyItem";
import {language} from "@/app/language";

export function HistorySection() {
    const [historyData, setHistoryData] = useState<History[]>([])

    useEffect(() => {
        getHistory().then(r => {
            setHistoryData(r)
        })
    }, []);

    return (
        historyData.length > 0 ?
            <div className="flex flex-col w-full items-center gap-1">
                {historyData.map((item, index) => (<HistoryItem item={item} key={index}/>))}
            </div>
            :
            <div className="w-full h-full flex items-center justify-center text-[16px] text-[#909097]">
                <p>{language("No history yet...")}</p>
            </div>
    )
}