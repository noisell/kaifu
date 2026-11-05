import React from 'react';

interface Props {
    username?: string | null;
    bg?: string;
}
export const AvatarBase = (props: Props) => {
    const { username, bg } = props;
    return (
        <span
            className={`flex items-center justify-center rounded-full h-[36px] w-[36px] ${bg ? bg : 'bg-[#272525]'} text-white text-[18px]`}
            style={{lineHeight: "18px"}}><p className="mt-0.5">{username ? username[0].toUpperCase() : "U"}</p>
        </span>
    );
}