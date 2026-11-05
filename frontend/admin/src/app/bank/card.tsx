'use client'

import React, {useState} from 'react';
import {numberFormat} from "@/app/utils";
import Image from "next/image"
import {EditIcon} from "@/app/bank/edit";
import {BankType} from "@/app/bank/types";
import {changeBank} from "@/app/bank/api";
import {Input, Modal} from "antd";
import {changeSettings} from "@/app/settings/api";

type Props = {
    title: string;
    count: number;
    img: string | React.ReactNode;
    type: BankType | "stars";
    changeCount: (count: number) => void;
    prefix?: string;
    change?: boolean;
    invest?: number;
    investAll?: number;
};

export function CardBank(props: Props) {
    const [value, setValue] = useState(props.count+"");
    const [open, setOpen] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        if (props.type == "stars") {
            changeSettings("stars", value).then(_ => {
                props.changeCount(Number(value))
                setConfirmLoading(false);
                setOpen(false);
            });
        }
        else {
            changeBank(props.type, parseFloat(value)).then(_ => {
                props.changeCount(parseFloat(value))
                setConfirmLoading(false)
                setOpen(false);
            })
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };
    
    return (
        <div className={"flex flex-col w-full rounded-2xl bg-[#f5f5f5] items-center gap-3 px-5 py-3"}>
            <div className="flex w-full items-center gap-3">
                {typeof props.img === "string" ? <Image src={props.img} alt={"img"} width={100} height={100}/> : props.img}
                <div className="flex flex-col items-start gap-2.5">
                    <span className="flex items-end gap-2">
                        <p className={"text-[20px] text-[#494747]"} style={{lineHeight: "20px"}}>{props.title}</p>
                        <span className="cursor-pointer -mt-5" onClick={showModal}><EditIcon/></span>
                    </span>
                    <span className={"flex items-end gap-2"}>
                        <p className={"text-[42px] text-[#141414] font-bold"} style={{lineHeight: "42px"}}>{numberFormat(Number(props.count.toFixed(0))).toString()}</p>
                        <p className="text-[#494747] font-medium text-[24px]" style={{lineHeight: "32px"}}>{props?.prefix}</p>
                    </span>
                </div>
            </div>
            {props.invest && props.investAll && (
                <div className={"flex w-full items-center gap-3 ml-5"}>
                    <div className={"flex items-center gap-1"}>
                        <p className={"text-[16px] text-[#494747]"} style={{lineHeight: "16px"}}>Инвестиций:</p>
                        <p className={"text-[20px] text-black font-bold"} style={{lineHeight: "20px"}}>{numberFormat(props.investAll)}</p>
                    </div>
                    <div className={"flex items-center gap-1"}>
                        <p className={"text-[16px] text-[#494747]"} style={{lineHeight: "16px"}}>Осталось:</p>
                        <p className={"text-[20px] text-black font-bold"} style={{lineHeight: "20px"}}>{numberFormat(props.invest)}</p>
                    </div>
                </div>
            )}
            <Modal
                title={`${props.title}`}
                open={open}
                onOk={handleOk}
                okText={"Сохранить"}
                cancelText={"Отменить"}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <div className="flex w-full">
                    <Input style={{borderRadius: "18px", height: "70px", fontSize: "30px"}}
                           size={"large"}
                           placeholder="Логин"
                           value={value}
                           onChange={(e) => {setValue(e.target.value)}}
                    />
                </div>
            </Modal>
        </div>
    );
}