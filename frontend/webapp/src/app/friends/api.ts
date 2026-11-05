import { userInstance } from "@/app/header/api";
import { FriendType } from "@/app/friends/types";

export async function getFriends(): Promise<FriendType[]> {
    const instance = await userInstance();
    const response = await instance.get("/friends")
    return response.data;
}

