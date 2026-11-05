'use client'

import React from 'react'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Navigation } from "@/app/navigation/component";
import { NavProvider } from "@/app/navigation/context";
import {Main} from "@/app/main";
import {TonConnectUIProvider} from "@tonconnect/ui-react";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en'>
        <head>
            <title>Create Next App</title>
        </head>
        <body>
        <TonConnectUIProvider manifestUrl="https://kaifugame.fun/tonconnect-manifest.json">
            <AntdRegistry>
                <NavProvider>
                    <Navigation/>
                    <Main children={children}/>
                </NavProvider>
            </AntdRegistry>
        </TonConnectUIProvider>
        </body>
        </html>
    )
}