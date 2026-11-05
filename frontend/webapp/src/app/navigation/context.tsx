'use client'
import React, { createContext, useContext, useState } from 'react'
import {number} from "prop-types";

type NavContextType = {
    activeButton: string
    setActiveButton: (path: string) => void
    showNavigation: boolean // Добавляем свойство для отображения навигации
    setShowNavigation: (show: boolean) => void
    countWon: number
    setCountWon: (countWon: number) => void
}

export const NavContext = createContext<NavContextType>({
    activeButton: '/',
    setActiveButton: () => {},
    showNavigation: false,
    setShowNavigation: () => {},
    countWon: 0,
    setCountWon: () => {},
})

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeButton, setActiveButton] = useState<string>('/')
    const [showNavigation, setShowNavigation] = useState<boolean>(false) // Состояние для отображения навигации
    const [countWon, setCountWon] = useState<number>(0)

    return (
        <NavContext.Provider
            value={{
                activeButton,
                setActiveButton,
                showNavigation,
                setShowNavigation,
                countWon,
                setCountWon,
            }}>
            {children}
        </NavContext.Provider>
    )
}

export const useNav = () => useContext(NavContext)
