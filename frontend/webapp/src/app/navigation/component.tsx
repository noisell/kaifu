'use client'
import React from 'react'
import { ConfigProvider, Badge } from 'antd'
import { useNav } from './context'
import Link from 'next/link'
import {HomeIcon} from "@/app/navigation/icons/home";
import {TicketIcon} from "@/app/navigation/icons/ticket";
import {TaskIcon} from "@/app/navigation/icons/task";
import {FriendIcon} from "@/app/navigation/icons/friend";
import {language} from "@/app/language";

export function Component() {
    const { activeButton, showNavigation, setActiveButton, countWon } = useNav()

    const activeColor = (href: string) => {
        return activeButton === href
            ? '#FFFFFF'
            : '#8a8eab'
    }
    if (!showNavigation) return null
    return (
        <div className={'flex w-full fixed bottom-0 pb-2 px-4 z-50 bg-transparent text-2xl text-black'}>
            <nav
                className={'flex w-full items-center justify-around py-4 px-7 z-55 bg-[#3d3e66] text-2xl text-black rounded-2xl'}>
                <ConfigProvider
                    theme={{
                        components: {
                            Badge: {
                                colorBorderBg: 'transparent',
                                fontSize: 12,
                                colorTextLightSolid: "#000",
                                colorError: "#12F291"
                            },
                        },
                    }}>
                    <Badge count={0}>
                        <Link
                            href={'/kaifu/frontend/webapp/public'}
                            onClick={() => {
                                Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                                setActiveButton('/')
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px',
                            }}>
                            <HomeIcon color={activeColor('/')}/>
                            <p style={{ fontSize: '11px', color: `${activeColor('/')}` }}>{language("Home")}</p>
                        </Link>
                    </Badge>
                    <Badge count={countWon > 0 ? countWon : 0}>
                        <Link
                            href={'/tickets'}
                            onClick={() => {
                                Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                                setActiveButton('/tickets')
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px',
                            }}>
                            <TicketIcon color={activeColor('/tickets')}/>
                            <p style={{fontSize: '11px', color: `${activeColor('/tickets')}`}}>{language("Tickets")}</p>
                        </Link>
                    </Badge>
                    <Badge count={0}>
                        <Link
                            href={'/tasks'}
                            onClick={() => {
                                Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                                setActiveButton('/tasks')
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px',
                            }}>
                            <TaskIcon color={activeColor('/tasks')}/>
                            <p style={{ fontSize: '11px', color: `${activeColor('/tasks')}` }}>{language("Tasks")}</p>
                        </Link>
                    </Badge>
                    <Badge count={0}>
                        <Link
                            href={'/friends'}
                            onClick={() => {
                                Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                                setActiveButton('/friends')
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px',
                            }}>
                            <span className="-mt-[2px]"><FriendIcon color={activeColor('/friends')}/></span>
                            <p style={{ fontSize: '11px', color: `${activeColor('/friends')}`, marginTop: "-2px" }}>{language("Frens")}</p>
                        </Link>
                    </Badge>
                </ConfigProvider>
            </nav>
        </div>
    )
}
