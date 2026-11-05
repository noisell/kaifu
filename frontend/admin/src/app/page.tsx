'use client'
import React, {useState, useEffect } from 'react';
import {authentication} from "@/app/api";
import {useNav} from "@/app/navigation/context";
import {ComponentAuth} from "@/app/auth/component";
import {LoadingItem} from "@/app/components/loading";
import {ComponentStats} from "@/app/stats/component";

export default function Home() {
    const [login, setLogin] = useState<boolean | undefined>(undefined);
    const { setShowNavigation } = useNav()

    useEffect(() => {
        authentication().then(r => {
            setLogin(r)
            setShowNavigation(r)
        })
    }, []);

    return (
        login === undefined ? <LoadingItem/>
            : login ? <div className="section"><ComponentStats/></div>
            : <ComponentAuth callback={() => {setLogin(true);setShowNavigation(true);}}/>
    );
}
