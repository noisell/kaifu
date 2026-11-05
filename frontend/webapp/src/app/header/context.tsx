'use client'
import React, { createContext, useContext, useState } from 'react'

type HeaderContextType = {
    course: number
    setCourse: (course: number) => void
    priceGold: number
    setPriceGold: (course: number) => void
    priceSilver: number
    setPriceSilver: (course: number) => void
    avatar: string | null
    setAvatar: (avatar: string) => void
    name: string
    setName: (name: string) => void
    silver: number
    setSilver: (silver: number) => void
    gold: number
    setGold: (gold: number) => void
}

export const HeaderContext = createContext<HeaderContextType>({
    course: 0,
    setCourse: () => {},
    priceGold: 1,
    setPriceGold: () => {},
    priceSilver: 1,
    setPriceSilver: () => {},
    avatar: "/avatar.jpeg",
    setAvatar: () => {},
    name: "JonWick",
    setName: () => {},
    silver: 0,
    setSilver: () => {},
    gold: 0,
    setGold: () => {}
})

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [course, setCourse] = useState<number>(1)
    const [priceGold, setPriceGold] = useState<number>(1)
    const [priceSilver, setPriceSilver] = useState<number>(1)
    const [avatar, setAvatar] = useState<string | null>(null)
    const [name, setName] = useState<string>("JonWick")
    const [silver, setSilver] = useState<number>(0)
    const [gold, setGold] = useState<number>(0)

    return (
        <HeaderContext.Provider
            value={{
                course: course,
                setCourse: setCourse,
                priceGold: priceGold,
                setPriceGold: setPriceGold,
                priceSilver: priceSilver,
                setPriceSilver: setPriceSilver,
                avatar: avatar,
                setAvatar: setAvatar,
                name: name,
                setName: setName,
                silver: silver,
                setSilver: setSilver,
                gold: gold,
                setGold: setGold
            }}>
            {children}
        </HeaderContext.Provider>
    )
}
export const useHeader = () => useContext(HeaderContext)