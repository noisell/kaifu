import React from 'react';
import {TopUpIcon} from "@/app/profile/icons/topUp";
import {History} from "@/app/profile/types";
import {WithdrawIcon} from "@/app/profile/icons/withdraw";
import {formatToUserTimezone} from "@/app/utils";
import {language} from "@/app/language";

interface Props {item: History}

export function HistoryItem(props: Props) {
    const {item} = props;
    const created_at = formatToUserTimezone(item.created_at, true, false);
    return (
        <div className="flex w-full items-center py-[18px] px-4 justify-between rounded-2xl bg-[#272626]">
            {item.type == "top_up"
                ?
                <>
                    <div className="flex items-center gap-2">
                        <span className="bg-[#313030] rounded-xl p-3"><TopUpIcon/></span>
                        <div className="flex flex-col gap-1">
                            <p className="text-[16px] text-white" style={{lineHeight: "16px"}}>{language("Top-up")}</p>
                            <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>{created_at}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <p className="text-[16px] text-[#12F29A]" style={{lineHeight: "16px"}}>+{item.gold} GOLD</p>
                        <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>{language("Received")}</p>
                    </div>
                </>
                :
                item.type == "withdraw"
                    ?
                    item.gold !== 0 ?
                    <>
                        <div className="flex items-center gap-2">
                            <span className="bg-[#313030] rounded-xl p-3"><WithdrawIcon/></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-[16px] text-white" style={{lineHeight: "16px"}}>{language("Withdraw")}</p>
                                <p className="text-[12px] text-[#909097]"
                                   style={{lineHeight: "12px"}}>{created_at}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <p className={`text-[16px] ${item.gold < 0 ? 'text-[#12F29A]' : 'text-white'}`} style={{lineHeight: "16px"}}>{item.amount} TON</p>
                            <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>{language("Sent")}</p>
                        </div>
                    </>
                        : null
                    :
                    <>
                        <div className="flex items-center gap-2">
                            <span className="bg-[#313030] rounded-xl p-3"><TopUpIcon/></span>
                            <div className="flex flex-col gap-1">
                                <p className="text-[14px] text-white" style={{lineHeight: "14px"}}>{item.type == "referrer" ? language("Referral victory") : language("Winning ticket")}</p>
                                <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>{created_at}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-[16px] text-[#12F29A]" style={{lineHeight: "16px"}}>+{item.gold} GOLD</p>
                            <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>{language("Received")}</p>
                        </div>
                    </>
            }
        </div>
    );
}