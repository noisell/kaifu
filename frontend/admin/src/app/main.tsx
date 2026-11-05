'use client'

import React, {useState, useEffect} from 'react';
import { DateTime } from 'luxon';
import {useNav} from "@/app/navigation/context";


export function Main({ children }: Readonly<{ children: React.ReactNode }>) {
    const format = "HH:mm:ss"
    const [time, setTime] = useState(''); // Инициализируем пустой строкой
    const [timeUser, setTimeUser] = useState('');
    const {showNavigation} = useNav()

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(DateTime.now().setZone('utc').toFormat(format));
            setTimeUser(DateTime.now().toFormat(format))
        }, 1000);

        return () => clearInterval(intervalId);
    }, [format]);

    return (
        <main>
            {showNavigation ? <header
                className="w-full text-black flex items-center pl-[28px] py-5 border-b-[1px] border-[#F0F0F0] gap-5">
                <div className={"flex items-center gap-1 w-[220px]"}>
                    <p className={"font-medium"}>Время сервера:</p> <p>{time}</p>
                </div>
                <div className={"flex items-center gap-1 w-[220px]"}>
                    <p className={"font-medium"}>Ваше время:</p> <p>{timeUser}</p>
                </div>
            </header> : null}
            {children}
        </main>
    );
}