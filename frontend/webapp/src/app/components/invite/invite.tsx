'use client'
import {TonIcon} from "@/app/icons/ton";
import {ArrowRightIcon} from "@/app/icons/arrowRight";
import React, {useState} from "react";
import {Drawer} from "@/app/components/drawer";
import {InviteDrawer} from "@/app/components/invite/drawer";
import {language} from "@/app/language";

export function Invite () {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <div className="flex w-full items-center bg-[#272525] rounded-[20px] px-4 py-3 mt-2 justify-between cursor-pointer"
             onClick={() => {
                 setOpen(!open);
             }}
        >
            <div className="flex items-center gap-2 ">
                <div className="flex items-center justify-center p-2 bg-[#39383b] rounded-xl">
                    <TonIcon/>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[14px]" style={{lineHeight: "14px"}}>{language("Invite friends and get TON")}</p>
                    <p className="text-[12px] text-[#909097]" style={{lineHeight: "12px"}}>{language("Full guide to get bonus")}</p>
                </div>
            </div>
            <ArrowRightIcon/>
            <Drawer open={open} setOpen={setOpen} content={<InviteDrawer/>}/>
        </div>
    )
}