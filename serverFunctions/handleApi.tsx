"use server"
import { food, newFood } from "@/types"
import { google } from "googleapis"
import path from "path"
import fs from "fs/promises"
import { v4 as uuidV4 } from "uuid"
// const auth = await google.auth.getClient({
//     scopes: ["https://www.googleapis.com/auth/spreadhsheets"]
// })

require('dotenv').config()

const spreadsheetId = process.env.SPREAD_SHEET_ID
const apiKey = process.env.API_KEY

const sheets = google.sheets({ version: 'v4', auth: apiKey });

export async function getFoodItems() {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "foods"
    });

    return response.data;
};









export async function getGoogleSheetData() {
    try {
        const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
        const jwt = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            undefined,
            // we need to replace the escaped newline characters
            // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
            process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, "\n"),
            scopes
        );

        const sheets = google.sheets({ version: "v4", auth: jwt });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: "foods",
        });

        return response.data.values;
    } catch (err) {
        console.log(err);
    }

    return [];
}


export async function appendGoogleSheetData(foodItem: newFood) {
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
            spreadsheetId: spreadsheetId,
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














export async function addFoodItem(foodItem: newFood) {
    const finalFoodObj: food = {
        id: uuidV4(),
        ...foodItem
    }

    await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "foods",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
            values: [
                [finalFoodObj.id, finalFoodObj.name, finalFoodObj.image, finalFoodObj.calories, finalFoodObj.weightInGrams],
            ]
        }
    })
};
