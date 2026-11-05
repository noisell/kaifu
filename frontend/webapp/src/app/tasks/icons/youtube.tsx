import React from 'react';

interface IconProps {
    width?: number
    height?: number
}

export function YouTubeIcon(props: IconProps) {
    const {width, height} = props;
    return (
        <svg width={width ? width : "32"} height={height ? height :"32"} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_194_11036)">
                <circle cx="15.5" cy="15.5" r="7.5" fill="white"/>
                <path
                    d="M25.354 4.67773H6.64599C2.97551 4.67773 0 7.65324 0 11.3237V20.6758C0 24.3462 2.97551 27.3217 6.64599 27.3217H25.354C29.0245 27.3217 32 24.3462 32 20.6758V11.3237C32 7.65324 29.0245 4.67773 25.354 4.67773ZM20.8594 16.4547L12.109 20.6281C11.8759 20.7393 11.6065 20.5693 11.6065 20.3111V11.7034C11.6065 11.4415 11.8829 11.2717 12.1166 11.3901L20.8669 15.8243C21.1271 15.9561 21.1226 16.3292 20.8594 16.4547Z"
                    fill="#F61C0D"/>
            </g>
            <defs>
                <clipPath id="clip0_194_11036">
                    <rect width="32" height="32" fill="white"/>
                </clipPath>
            </defs>
        </svg>

    );
}