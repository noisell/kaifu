export function parseReferrerID(startParam: string): number | null {
    if (startParam.startsWith('friend')) {
        const userId = startParam.replace('friend', '')
        if (/^\d+$/.test(userId)) {
            return Number(userId)
        }
    }
    return null
}

export async function setCloudStorageItem(key: string, value: string) {
    Telegram.WebApp.CloudStorage.setItem(key, value)
}

export async function removeCloudStorageItem(key: string) {
    Telegram.WebApp.CloudStorage.removeItem(key)
}

export async function getCloudStorageItem(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        Telegram.WebApp.CloudStorage.getItem(key, (error, value) => {
            if (error) reject(new Error(error))
            else resolve(value)
        })
    })
}

export function numberFormat(number: number): string {
    if (number < 1000) {
        return number.toString();
    } else {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

export function longNumberFormat(number: number): string {
    if (number < 1000) {
        return number.toString();
    }
    if (number < 1000000) {
        return `${numberFormat(number).split(" ")[0]}K`;
    }
    else {
        return `${numberFormat(number).split(" ")[0]}M`;
    }
}

export function padNumber(number: string): string {
    return number.padStart(6, '0');
}

export function calculateTimeLeft(updated_at: string): number {
    const updatedAtDate = new Date(updated_at);
    const now = new Date();
    const diffSeconds = (24 * 60 * 60) - (now.getTime() - updatedAtDate.getTime()) / 1000;
    return Math.max(0,diffSeconds); //Возвращаем неотрицательное значение
}

export function formatToUserTimezone(dateString: string, simpleFormat: boolean = false, secondNeed: boolean = true): string {
    // Преобразуем строку в объект Date (UTC)
    const date = new Date(dateString)

    // Получаем смещение временной зоны пользователя в минутах
    const timezoneOffsetMinutes = date.getTimezoneOffset()

    // Применяем смещение к дате
    const userDate = new Date(date.getTime() - timezoneOffsetMinutes * 60 * 1000)

    // Получаем компоненты даты с учётом локального времени пользователя
    const day = String(userDate.getDate()).padStart(2, '0') // День с ведущим нулём
    const month = String(userDate.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
    const year = userDate.getFullYear()

    // Получаем компоненты времени с учётом локального времени пользователя
    const hours = String(userDate.getHours()).padStart(2, '0')
    const minutes = String(userDate.getMinutes()).padStart(2, '0')
    const seconds = String(userDate.getSeconds()).padStart(2, '0')

    // Форматируем в строку "dd.mm.yyyy hh:mm:ss"
    return simpleFormat ? `${day}.${month}.${year} ${hours}:${minutes}${secondNeed ? `:${seconds}` : ''}` : `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

const pad = (num: number): string => num.toString().padStart(2, '0');

export const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

export function daysSinceDate(dateString: string): number {
    const inputDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifferenceMs = currentDate.getTime() - inputDate.getTime();
    return 30 - (Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24)));
}

