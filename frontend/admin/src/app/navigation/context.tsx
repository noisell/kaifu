'use client'
import React, { createContext, useContext, useState } from 'react'

type NavContextType = {
    showNavigation: boolean // Добавляем свойство для отображения навигации
    setShowNavigation: (show: boolean) => void
    active: string
    setActive: (active: string) => void
}

export const NavContext = createContext<NavContextType>({
    showNavigation: false,
    setShowNavigation: () => {},
    active: "/",
    setActive: (active: string) => {}
})

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
    const [showNavigation, setShowNavigation] = useState<boolean>(false) // Состояние для отображения навигации
    const [active, setActive] = useState<string>("/")

    return (
        <NavContext.Provider value={{showNavigation, setShowNavigation, active, setActive}}>
            {children}
        </NavContext.Provider>
    )
}

export const useNav = () => useContext(NavContext)
