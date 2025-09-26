import { post } from "./api";

export async function registerUser(userData) {
    return await post("/api/auth/register", userData)
}