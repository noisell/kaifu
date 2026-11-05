'use client'
import React from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { StyledEngineProvider } from '@mui/material/styles';

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    content: React.ReactNode
}

export function Drawer (props: Props) {
    const { open, setOpen, content } = props
    return (
        <StyledEngineProvider injectFirst>
            <SwipeableDrawer
                variant={"temporary"}
                anchor='bottom'
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                className='bg-transparent'
                style={{ backgroundColor: 'transparent' }}>
                {content}
            </SwipeableDrawer>
        </StyledEngineProvider>
    )
}