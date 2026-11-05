'use client'

import React from 'react'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { TelegramProvider } from '@/app/telegram/context'
import { NavProvider } from '@/app/navigation/context'
import { Component } from '@/app/navigation/component'
import { HeaderComponent } from "@/app/header/component";
import { HeaderProvider } from "@/app/header/context";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en'>
            <head>
                <title>KAIFU</title>
                <script src='https://telegram.org/js/telegram-web-app.js'/>
                {/* Yandex.Metrika counter */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        m[i].l=1*new Date();
                        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        
        
                        ym(99101265, "init", {
                            clickmap:true,
                            trackLinks:true,
                            accurateTrackBounce:true,
                            webvisor:true
                        });
                    `
                }} />
                <noscript><div><img src="https://mc.yandex.ru/watch/99101265" style={{ position: "absolute", left: "-9999px" }} alt="" /></div></noscript>
                {/* /Yandex.Metrika counter */}
            </head>
            <body suppressHydrationWarning={true}>
                <div className="blur-container blur-container-top"/>
                <TonConnectUIProvider manifestUrl="https://kaifugame.fun/tonconnect-manifest.json">
                    <TelegramProvider>
                        <NavProvider>
                            <HeaderProvider>
                                <AntdRegistry>
                                    <HeaderComponent/>
                                    {children}
                                    <Component/>
                                </AntdRegistry>
                            </HeaderProvider>
                        </NavProvider>
                    </TelegramProvider>
                </TonConnectUIProvider>
                <div className="blur-container blur-container-bottom"/>
            </body>
        </html>
    )
}