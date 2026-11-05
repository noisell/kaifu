'use client'

import React, {useEffect, useState} from 'react'
import {useRouter} from "next/navigation";
import {Invite} from "@/app/components/invite/invite";
import {useTelegram} from "@/app/telegram/context";
import {useNav} from "@/app/navigation/context";
import {getAllTickets, getCountTicketsWon, getTicketsWon} from "@/app/tickets/api";
import {TicketSchema, TicketWon} from "@/app/tickets/types";
import {Ticket} from "@/app/tickets/components/ticket";
import {language} from "@/app/language";

export default function Friends() {
    const router = useRouter();
    const { webApp, user } = useTelegram()
    const { setActiveButton, setShowNavigation, setCountWon } = useNav()
    const [tickets, setTickets] = useState<TicketSchema[]>();
    const [ticketsWon, setTicketsWon] = useState<TicketWon[]>([]);

    useEffect(() => {
        if (webApp && user) {
            const backButton = Telegram.WebApp.BackButton
            const popupClosed = (eventData: { button_id: string | null }) => {
                if (eventData.button_id === 'closeWebApp') {
                    Telegram.WebApp.close()
                }
            }
            setShowNavigation(true)
            setActiveButton('/tickets')
            backButton.show()
            backButton.onClick(() => router.back())
            Telegram.WebApp.onEvent('popupClosed', popupClosed)
            return () => {
                backButton.hide()
                backButton.offClick(() => router.back())
                Telegram.WebApp.offEvent('popupClosed', popupClosed)
            }
        }
    }, [user]);

    useEffect(() => {
        getAllTickets().then(r => {
            setTickets(r)
        })
        getTicketsWon().then(r => {
            setTicketsWon(r)
        })
        getCountTicketsWon().then(r => {setCountWon(r)})
    }, []);

    return (
        <main>
            <Invite/>
            <div className="flex w-full flex-col gap-2 items-center mt-5">
                {
                    tickets
                        ?
                        tickets.length > 0
                            ?
                            tickets.map((ticket) => (
                                <Ticket
                                    ticket={ticket}
                                    key={ticket.id}
                                    won={ticketsWon.find((ticketWon) => ticket.id === ticketWon.ticket_id)}
                                    wins={ticketsWon.filter((ticketWon) => ticket.id === ticketWon.ticket_id).map((ticketWon) => ticketWon)}
                                />
                            ))
                            :
                            <p className="text-[16px] text-[#909097]">{language("You don't have tickets yet")}</p>
                        :
                        <p className="text-[16px] text-[#909097]">{language("Loading...")}</p>
                }
            </div>
        </main>
    )
}