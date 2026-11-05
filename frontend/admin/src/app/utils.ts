import {MessageInstance} from "antd/es/message/interface";

export const error = (messageApi: MessageInstance, text: string) => {
    messageApi
        .open({
            type: 'error',
            content: text
        })
        .then(() => {
            return
        })
}

export const success = (messageApi: MessageInstance, text: string) => {
    messageApi
        .open({
            type: 'success',
            content: text

        })
        .then(() => {
            return
        })
}

export function numberFormat(number: number): string {
    if (number < 1000) {
        return number.toString();
    } else {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

export function padNumber(number: string): string {
    return number.padStart(6, '0');
}
