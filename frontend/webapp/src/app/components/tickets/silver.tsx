import React, {useState} from 'react';
import Image from "next/image";
import {DailyIcon} from "@/app/icons/daily";
import {TrueIcon} from "@/app/icons/true";
import {TicketSilverIcon} from "@/app/icons/ticketSilver";
import {Drawer} from "@/app/components/drawer";
import {DrawerTicket} from "@/app/components/tickets/drawer";
import {language} from "@/app/language";

interface Props {
    price: number;
}

export function Silver(props: Props) {
    const { price } = props;
    const [open, setOpen] = useState(false);
    return (
        <div
            className="relative flex flex-col w-full items-center gap-2 bg-[#272525] rounded-[20px] px-5 pt-4 pb-5 mt-2 overflow-hidden">
            <div className="flex w-full items-center justify-between">
                <p className="text-[18px]">{language("Silver")} {language("ticket")}</p>
                <div className="flex items-center gap-1 text-[15px]">
                    <div className="flex items-center gap-0.5">
                        <Image src={"/silver-coin.png"} alt="" width={22} height={22}/>
                        <p>{price}</p>
                    </div>
                    <p className="text-[#909097]">KAIFU</p>
                </div>
            </div>
            <div className="flex w-full items-center gap-1">
                <div className="flex flex-col p-2 rounded-xl bg-[#313030] w-full gap-1.5">
                    <p className="text-[16px]" style={{lineHeight: "16px"}}>10%</p>
                    <p className="text-[12px] text-[#909097]">{language("of the")}<br/>{language("winnings")}</p>
                </div>
                <div className="flex flex-col p-2 rounded-xl bg-[#313030] w-full gap-1.5">
                    <p className="text-[16px]" style={{lineHeight: "16px"}}><DailyIcon/></p>
                    <p className="text-[12px] text-[#909097]">{language("daily")}<br/>{language("confirmation")}</p>
                </div>
                <div className="flex flex-col p-2 rounded-xl bg-[#313030] w-full gap-1.5">
                    <p className="text-[16px]" style={{lineHeight: "16px"}}><TrueIcon/></p>
                    <p className="text-[12px] text-[#909097]">{language("auto ticket")}<br/>{language("assignment")}</p>
                </div>
            </div>
            <button
                className="flex w-full py-3 items-center justify-center rounded-xl bg-white text-[14px] text-black mt-2 gap-2"
                onClick={() => {setOpen(!open)}}
            >
                {language("Get ticket")} <span className="-mt-0.5"><TicketSilverIcon/></span>
            </button>
            <Drawer open={open} setOpen={setOpen} content={<DrawerTicket coin={"silver"} price={price}/>}/>
        </div>
    );
}