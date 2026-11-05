import React from 'react';
import {DataType} from "@/app/users/types";
import {Checkbox, InputNumber} from "antd";
import Image from "next/image";

type Props = {
    user: DataType
    setUser: (user: DataType) => void
};

export function ModalUser(props: Props) {
    const {user, setUser} = props;
    return (
        <div className="flex w-full flex-col">
            <span className={"flex w-full items-center gap-5 mt-3"}>
                <span className={"flex w-full items-center gap-2"}>
                    <Image src={"/gold-coin.png"} alt={"GOLD"} width={32} height={32}/>
                    <InputNumber style={{borderRadius: "12px", width: "100%"}} size={"middle"} placeholder="Кол-во"
                                 value={user.gold_coins}
                                 onChange={(e) => setUser({...user, gold_coins: e ? e : 0})}/>
                </span>
                <span className={"flex w-full items-center gap-2"}>
                    <Image src={"/silver-coin.png"} alt={"SILVER"} width={32} height={32}/>
                    <InputNumber style={{borderRadius: "12px", width: "100%"}} size={"middle"} placeholder="Кол-во"
                                 value={user.silver_coins}
                                 onChange={(e) => setUser({...user, silver_coins: e ? e : 0})}/>
                </span>
            </span>
            <span className={"flex w-full items-center mt-5 pl-2"}>
                <Checkbox onChange={(e) => {
                    setUser({...user, banned: e.target.checked ? "Да" : "Нет"})
                }} checked={user.banned === "Да"}><p className="text-[16px]">Заблокировать?</p></Checkbox>
            </span>
        </div>
)
}