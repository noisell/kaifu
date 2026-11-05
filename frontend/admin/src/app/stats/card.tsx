import React from 'react';
import {numberFormat} from "@/app/utils";

type Props = {
    title: string;
    all: number;
    today?: number;
    prefix?: string;
};

export function Card(props: Props) {
    return (
        <div className={"flex flex-col w-full rounded-2xl bg-[#f5f5f5] items-start px-7 py-3"}>
            <p className={"text-[20px]"}>{props.title}</p>
            <p className={"text-[36px] text-[#1777FF] font-medium"}>{numberFormat(props.all)} {props?.prefix}</p>

            { props.today !== undefined &&
                <>
                    <span className="w-full h-[1px] bg-blue-200 mb-2 mt-3"></span>
                    <p className={"flex text-[18px]"}>Сегодня: <p className="text-green-500 ml-2 font-medium">+{numberFormat(props.today)} {props?.prefix}</p></p>
                </>
            }
        </div>
    );
}