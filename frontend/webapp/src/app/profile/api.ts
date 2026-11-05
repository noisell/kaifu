import {userInstance} from "@/app/header/api";
import {History, HistoryUpdate} from "@/app/profile/types";
import {language} from "@/app/language";

export async function getHistory(): Promise<History[]> {
    const instance = await userInstance();
    const response = await instance.get("/history")
    return response.data;
}

export async function updateHistory(data: HistoryUpdate) {
    const instance = await userInstance();
    try {
        await instance.post("/history", {...data});
        return true;
    }
    catch (error) {
        Telegram.WebApp.showPopup({
            title: language("Insufficient funds"),
            message: language("Please try again later"),
            buttons: [{ id: 'ok', type: 'ok'}]
        });
        return false;
    }
}