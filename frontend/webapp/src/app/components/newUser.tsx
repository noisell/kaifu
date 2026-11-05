import React, {useState} from 'react';
import Image from "next/image";
import {language} from "@/app/language";

type PageType = 1 | 2 | 3 | 4 | 5;

export function NewUser() {
    const [page, setPage] = useState<PageType>(1);

    const texts: Record<PageType, React.ReactNode> = {
        1: <p>{language("Get your free ticket &")}<br/>{language("endless rewards with friends!")}</p>, // +
        2: <p>{language("Claim your rewards")}<br/>{language("in TON")}</p>, // +
        3: <p>{language("Get tickets and win")}<br/>{language("within 30 days")}</p>, // +
        4: <p>{language("Get 20% from your friend's")}<br/>{language("gold tickets and rewards")}</p>, // +
        5: <p>{language("The more of us")}<br/>{language("the bigger the prizes!")}</p>, // +
    }

    const images: Record<PageType, React.ReactNode> = {
        1:
            <div className="relative flex mt-10">
                <Image src={"/silver-coin.png"} alt={"Tickets"} width={250} height={250} style={{zIndex: "10"}}/>
                <div className="glareRoundBig glareRoundRef"/>
            </div>,
        2:
            <div className="relative flex mt-10">
                <Image src={"/tons2.svg"} alt={"Tickets"} width={300} height={300} style={{zIndex: "10"}}/>
                <div className="glareRoundBig glareRoundTons"/>
            </div>, // +
        3:
            <div className="relative flex mt-10">
                <Image src={"/tickets.svg"} alt={"Tickets"} width={300} height={300} style={{zIndex: "10"}}/>
                <div className="glareRoundBig glareRoundTickets"/>
            </div>, // +
        4:
            <div className="relative flex mt-10 ml-3">
                <Image src={"/ref.svg"} alt={"Tickets"} width={300} height={300} style={{zIndex: "10"}}/>
                <div className="glareRoundBig glareRoundRef"/>
            </div>, // +
        5:
            <div className="relative flex mt-10">
                <Image src={"/friends.svg"} alt={"Tickets"} width={300} height={278} style={{zIndex: "10"}}/>
                <div className="glareRoundBig glareRoundTons"/>
            </div>,
    };

    const handleNext = () => {
        if (page < 5) setPage(page + 1 as PageType);
        else window.location.reload();
    }
    return (
        <main className="h-screen">
            {images[page]}
            <div className="flex flex-col w-full items-center mt-auto">
                <span className="text-[20px] flex w-full items-center justify-center text-white text-center" style={{lineHeight: "24px", fontWeight: 600}}>
                    {texts[page]}
                </span>
                <div className="flex items-center gap-1 mt-3">
                    <span className={`${page === 1 ? 'w-[20px] bg-[#FFF]' : 'w-[6px] bg-[#626168]'} h-[6px] rounded-full cursor-pointer`} onClick={() => setPage(1)}/>
                    <span className={`${page === 2 ? 'w-[20px] bg-[#FFF]' : 'w-[6px] bg-[#626168]'} h-[6px] rounded-full cursor-pointer`} onClick={() => setPage(2)}/>
                    <span className={`${page === 3 ? 'w-[20px] bg-[#FFF]' : 'w-[6px] bg-[#626168]'} h-[6px] rounded-full cursor-pointer`} onClick={() => setPage(3)}/>
                    <span className={`${page === 4 ? 'w-[20px] bg-[#FFF]' : 'w-[6px] bg-[#626168]'} h-[6px] rounded-full cursor-pointer`} onClick={() => setPage(4)}/>
                    <span className={`${page === 5 ? 'w-[20px] bg-[#FFF]' : 'w-[6px] bg-[#626168]'} h-[6px] rounded-full cursor-pointer`} onClick={() => setPage(5)}/>
                </div>
                <button className="flex mt-20 items-center justify-center w-full py-3 rounded-xl text-[14px] bg-gradient-to-r from-[#0D70F2] to-[#0DAEF2]" onClick={handleNext}>
                    {language("Next")}
                </button>
            </div>
        </main>
    );
}