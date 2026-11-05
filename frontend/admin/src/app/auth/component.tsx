import React, {useState} from 'react';
import {Input, Checkbox, message, ConfigProvider} from 'antd';
import type { CheckboxProps } from 'antd';
import {authentication} from "@/app/api";
import {error} from "@/app/utils";

export function ComponentAuth(props: {callback: () => void}) {
    const [login, setLogin] = useState("");
    const [pass, setPass] = useState("");
    const [checkBox, setCheckBox] = useState(true);
    const [messageApi, contextHolder] = message.useMessage()
    const onChange: CheckboxProps['onChange'] = (e) => {
        setCheckBox(e.target.checked);
    };
    const handleClick = () => {
        authentication({login: login, password: pass, remember_me: checkBox}).then(r => {
            if (r) {
                return props.callback();
            }
            else {
                error(messageApi, "Неверный логин или пароль")
                setLogin("");
                setPass("");
            }
        })
    }
    return (
        <div className="flex w-screen h-screen items-center justify-center -mt-20">
            <ConfigProvider theme={{components: {Message: {contentBg: '#F2F2F2', colorText: '#141414'}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#f2f2f2] gap-3">
                <h1 className="text-[20px] mb-2">Авторизация</h1>
                <Input style={{borderRadius: "12px"}} size={"large"} placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                <Input.Password style={{borderRadius: "12px"}} size={"large"} placeholder="Пароль" value={pass} onChange={(e) => setPass(e.target.value)} />
                <Checkbox onChange={onChange} checked={checkBox} className="w-11/12">Запомнить вход</Checkbox>
                <button
                    onClick={handleClick}
                    className={`rounded-xl ${login && pass ? 'bg-blue-400 text-white cursor-pointer' : 'bg-white text-gray-600 cursor-not-allowed'} w-full py-2`}>
                    Войти
                </button>
            </div>
        </div>
    );
}