'use client'
import React, {useEffect, useState} from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export function LoadingItem() {
    const [text, setText] = useState('');
    useEffect(() => {
        setText(['Вычисляем', 'Обрабатываем', 'Думаем', 'Подгружаем', 'Готовимся', 'Анализируем', 'Сопостовляем'][Math.floor(Math.random() * 7)]);
    }, []);
    return (
        <div className="flex absolute z-10 flex-col gap-3 w-screen h-screen -mt-10 items-center justify-center">
            <Spin size="large" indicator={<LoadingOutlined spin />} />
            {text}
        </div>
    );
}