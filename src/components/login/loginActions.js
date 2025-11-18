"use server"

import {cookies} from "next/headers";

export const handleLogin = async (data) => {
    try {
        const res = await fetch(`${process.env.baseApi}/api/v1/users/login`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!res.ok) {
            const error = await res.json();
            // Return an error object
            return {success: false, error: error.message};
        }

        const final = await res.json();
        const cookie = await cookies();
        cookie.set("user-token", final.token, {
            httpOnly: true,
            sameSite: "strict"
        })
        cookie.set("user", JSON.stringify(final.data.user), {
            httpOnly: true,
            sameSite: "strict"
        })
        // Return a success object
        return {success: true, data: final};
    } catch (err) {
        // Return a generic error object
        return {success: false, error: "An unexpected error occurred."};
    }
}
