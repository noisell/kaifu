import React from 'react';

interface IconProps {
    width?: number
    height?: number
}

export function XIcon(props: IconProps) {
    const {width, height} = props;
    return (
        <svg width={width ? width : "28"} height={height ? height :"26"} viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M0.951755 0.727539L11.0767 14.2655L0.887817 25.2725H3.18093L12.1013 15.6358L19.3087 25.2725H27.1122L16.4176 10.973L25.9013 0.727539H23.6082L15.393 9.60282L8.75529 0.727539H0.951755ZM4.32394 2.41665H7.9089L23.7395 23.5831H20.1545L4.32394 2.41665Z"
                fill="white"/>
        </svg>
    );
}