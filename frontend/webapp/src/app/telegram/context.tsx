'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ITelegramUser, IWebApp } from './types'

export interface ITelegramContext {
    webApp?: IWebApp
    user?: ITelegramUser
}

export const TelegramContext = createContext<ITelegramContext>({})

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
    const [webApp, setWebApp] = useState<IWebApp | null>(null)

    useEffect(() => {
        const app = (window as any).Telegram?.WebApp
        if (app && !webApp) {
            app.ready()
            app.expand()
            app.disableVerticalSwipes()
            app.lockOrientation()
            setWebApp(app)
        }
    }, [])

    const value = useMemo(() => {
        return webApp
            ? {
                webApp,
                unsafeData: webApp?.initDataUnsafe,
                user: webApp?.initDataUnsafe.user,
            }
            : {}
    }, [webApp])

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    )
}

export const useTelegram = () => useContext(TelegramContext)
