import React, {useState} from 'react';
import Image from "next/image";
import {EditIcon} from "@/app/icons/edit";
import {TicketGoldIcon} from "@/app/icons/ticketGold";
import {DrawerTicket} from "@/app/components/tickets/drawer";
import {Drawer} from "@/app/components/drawer";
import {language} from "@/app/language";

interface Props {
    price: number;
}

export function Gold(props: Props) {
    const { price } = props;
    const [open, setOpen] = useState(false);
    return (
        <div
            className="relative flex flex-col w-full items-center gap-2 bg-[#272525] rounded-[20px] px-5 pt-4 pb-5 mt-5 overflow-hidden">
            <div className="glareRoundBig glareRoundGold"/>
            <div className="glareRoundBig glareRoundSilver"/>
            <div className="flex w-full items-center justify-between z-10">
                <p className="text-xl">{language("Gold")} {language("ticket")}</p>
                <div className="flex items-center gap-1 text-[15px]">
                    <div className="flex items-center gap-0.5">
                        <Image src={"/gold-coin.png"} alt="" width={22} height={22}/>
                        <p>{price}</p>
                    </div>
                    <p className="text-[#909097]">GOLD</p>
                </div>
            </div>
            <div className="flex w-full items-center gap-1">
                <div className="flex flex-col p-2 rounded-xl bg-[#403A32] w-full gap-1.5 z-10">
                    <p className="text-[16px]" style={{lineHeight: "16px"}}>100%</p>
                    <p className="text-[12px] text-[#909097]">{language("of the")}<br/>{language("winnings")}</p>
                </div>
                <div className="flex flex-col p-2 rounded-xl bg-[#403A32] w-full gap-1.5 z-10">
                    <p className="text-[16px]" style={{lineHeight: "16px"}}>30</p>
                    <p className="text-[12px] text-[#909097]">{language("days")}<br/>{language("of play")}</p>
                </div>
                <div className="flex flex-col p-2 rounded-xl bg-[#403A32] w-full gap-1.5 z-10">
                    <p className="text-[16px]" style={{lineHeight: "16px"}}><EditIcon/></p>
                    <p className="text-[12px] text-[#909097]">{language("pick a ticket")}<br/>{language("number")}</p>
                </div>
            </div>
            <button
                className="flex z-10 w-full py-3 items-center justify-center rounded-xl bg-[#fcb346] text-[14px] text-black mt-2 gap-2"
                onClick={() => {setOpen(!open)}}
            >
                {language("Get ticket")} <span className="-mt-0.5"><TicketGoldIcon/></span>
            </button>
            <Drawer open={open} setOpen={setOpen} content={<DrawerTicket coin={"gold"} price={price}/>}/>
        </div>
    );
}