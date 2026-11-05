'use client'
import React, {useState, useEffect} from 'react';
import { Input, ConfigProvider } from 'antd';
import type { GetProps } from 'antd';
import {checkNumber, setNumberTicket} from "@/app/tickets/api";
import {WarningTicketIcon} from "@/app/tickets/icons/warning";
import {language} from "@/app/language";

interface Props {
    ticketId: number;
    onClose: (lot: number, number: number) => void;
}

export function NumberDrawer(props: Props) {
    const [active, setActive] = useState<boolean>(false);
    const [number, setNumber] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);
    type OTPProps = GetProps<typeof Input.OTP>;

    const onChange: OTPProps['onChange'] = (text) => {
        if (/^\d+$/.test(text)) setNumber(Number(text))
        else setNumber(0)
    };
    useEffect(() => {
        if (number) {
            checkNumber(props.ticketId, number).then(r => {
                if (r) {
                    setError(false);
                }
                else {
                    setError(true);
                }
                setActive(r);
            })
        }
        else setActive(false);
    }, [number]);

    const warning = () => {
        return (
            <div className="flex mt-2 w-full items-center gap-2 py-2 px-3 text-[12px] bg-[#473927] rounded-xl">
                <WarningTicketIcon/>
                <p>{language("The ticket number is already occupied")}</p>
            </div>
        )
    }

    const onClickActivate = () => {
        if (number) {
            checkNumber(props.ticketId, number).then(r => {
                if (r) {
                    setError(false);
                    setNumberTicket(props.ticketId, number).then(r => {
                        props.onClose(r.lot, r.number);
                    })
                }
                else {
                    setError(true);
                }
                setActive(r);
            })
        }
        else setActive(false);
    }
    const [paddingBottom, setPaddingBottom] = useState<number>(20)
    return (
        <div className='flex flex-col w-full items-center px-7 pt-3 bg-[#28292D] rounded-t-3xl text-white'
             style={{paddingBottom: `${paddingBottom}px`}}
             onClick={(e) => {e.stopPropagation()}}
        >
            <span className='w-10 h-1 bg-[#555454] rounded-xl mb-5'></span>
            <p className="text-center text-[24px] mt-5" style={{lineHeight: "24px"}}>{language("Enter number ticket")}</p>
            <div className="w-full flex items-center mt-5">
                <ConfigProvider
                    theme={{
                        components: {
                            Input: {
                                fontSize: 36,
                                hoverBg: "#35363B",
                                hoverBorderColor: "transparent",
                                activeShadow: "none",
                                activeBg: "#35363B",
                                activeBorderColor: "transparent",
                                addonBg: "transparent",
                                colorBgContainer: "#35363B",
                                colorBgContainerDisabled: "transparent",
                                colorBorder: "transparent",
                                colorPrimaryHover: "transparent",
                                colorText: "white",
                                borderRadius: 14
                            },
                        },
                    }}>
                    <Input.OTP
                        onChange={onChange}
                        style={{width:'100%'}}
                        type='number'
                        formatter={(str) => {
                            if (/^\d+$/.test(str)) return str
                            else return ""
                        }}
                        onFocus={() => {setPaddingBottom(prevState => prevState + 350)}}
                        onBlur={() => {setPaddingBottom(28)}}
                    />
                </ConfigProvider>
            </div>
            {error && warning()}
            {active ?
                <button
                    onClick={onClickActivate}
                    className="flex mt-5 gap-2 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gradient-to-r from-[#0D70F2] to-[#0DAEF2]">
                    {language("Activate ticket")}
                </button>
                :
                <button
                    className="flex mt-5 gap-2 items-center justify-center w-full py-3.5 rounded-2xl text-[14px] bg-gray-600">
                    {language("Activate ticket")}
                </button>
            }
        </div>
    );
}