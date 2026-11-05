import React from "react";
import {language} from "@/app/language";

interface Props {
    color: string;
    value: string | number | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export function CustomInput (props: Props) {
    return (
        <input
            type={"text"}
            className={`flex w-2/3 text-[36px] font-medium bg-transparent border-none focus:outline-none`}
            style={{lineHeight: "36px", color: props.color}}
            value={props.value}
            placeholder={props.placeholder ? props.placeholder : language("Sum")}
            onChange={props.onChange}
        />
    )
}