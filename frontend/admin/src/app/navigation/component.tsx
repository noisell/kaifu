'use client'
import React from 'react';
import {
    DollarOutlined,
    UserOutlined,
    SettingOutlined,
    BankOutlined,
    BarChartOutlined,
    ThunderboltOutlined,
    FireOutlined,
    CheckCircleOutlined, SolutionOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {useNav} from "@/app/navigation/context";
import {useRouter} from "next/navigation";
import Image from "next/image";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '/',
        label: 'Статистика',
        icon: <BarChartOutlined />,
    },
    {
        key: '/users',
        label: 'Пользователи',
        icon: <UserOutlined />,
    },
    {
        key: '/transactions',
        label: 'Транзакции',
        icon: <DollarOutlined />,
    },
    {
        key: '/bank',
        label: 'Банк',
        icon: <BankOutlined />,
    },
    {
        key: '/lottery',
        label: 'Розыгрыши',
        icon: <ThunderboltOutlined />,
        children: [
            {key: "/tickets", label: "Билеты", icon: <SolutionOutlined />},
            {key: "/wins", label: "Выигрыши", icon: <CheckCircleOutlined />},
            {type: 'divider'},
            {key: "/jackpot", label: "Jackpot", icon: <FireOutlined />},
        ]
    },
    {
        type: 'divider',
    },
    {
        key: '/settings',
        label: 'Настройки',
        icon: <SettingOutlined />,
    }

];

export function Navigation() {
    const {showNavigation, active} = useNav()
    const router = useRouter();

    const onClick: MenuProps['onClick'] = (e) => {
        router.push(e.key);
    };
    if (!showNavigation) {return}
    return (
        <div className="relative flex flex-col w-[256px] max-h-screen h-auto overflow-y-auto">
            <span className="w-full gap-3 flex items-center pl-[28px] font-bold py-5 border-b-[1px] border-r-[1px] border-[#F0F0F0]">
                <Image src={"/logo.svg"} alt={"Logo"} width={16} height={16} />
                KAIFU PANEL
            </span>
            <Menu
                onClick={onClick}
                style={{ width: "100%", height: "100%" }}
                defaultSelectedKeys={[active]}
                defaultOpenKeys={[active]}
                mode="inline"
                items={items}
            />
        </div>
    );
}