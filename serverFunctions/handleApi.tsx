"use server"
import { food, newFood } from "@/types"
import { google } from "googleapis"
import { v4 as uuidV4 } from "uuid"


const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const jwt = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes
);

const sheets = google.sheets({ version: "v4", auth: jwt });
const spreadsheetId = process.env.SPREAD_SHEET_ID

export async function getFoodItems() {
    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "foods",
    });

    return response.data.values;
}

export async function addFoodItem(foodItem: newFood) {
    const finalFoodObj: food = {
        id: uuidV4(),
        ...foodItem
    }

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        // range: "foods!A:A",
        range: "foods",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
            values: [
                [finalFoodObj.id, finalFoodObj.name, finalFoodObj.image, finalFoodObj.calories, finalFoodObj.weightInGrams],
            ]
        }
    })
}

export async function updateFoodItem(foodItem: food, index: number) {
    console.log(`$received`, foodItem, index);

    const spreadRow = index + 1 //rows start at 1
    console.log("range", `${spreadRow}:${spreadRow}`);

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${spreadRow}:${spreadRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                [foodItem.id, foodItem.name, foodItem.image, foodItem.calories, foodItem.weightInGrams],
            ]
        }
    })

    console.log(`$worked to update`);
}






