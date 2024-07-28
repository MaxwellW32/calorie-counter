"use server"
import { food, newFood } from "@/types"
import { google } from "googleapis"
import { v4 as uuidV4 } from "uuid"

export async function getFoodItems() {
    try {
        const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
        const jwt = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            undefined,
            process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
            scopes
        );

        const sheets = google.sheets({ version: "v4", auth: jwt });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREAD_SHEET_ID,
            range: "foods",
        });

        return response.data.values;
    } catch (err) {
        console.log(err);
    }

    return [];
}

export async function addFoodItem(foodItem: newFood) {
    try {
        const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
        const jwt = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            undefined,
            process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
            scopes
        );

        const sheets = google.sheets({ version: "v4", auth: jwt });

        const finalFoodObj: food = {
            id: uuidV4(),
            ...foodItem
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREAD_SHEET_ID,
            range: "foods",
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                values: [
                    [finalFoodObj.id, finalFoodObj.name, finalFoodObj.image, finalFoodObj.calories, finalFoodObj.weightInGrams],
                ]
            }
        })

    } catch (err) {
        console.log(err);
    }

}






