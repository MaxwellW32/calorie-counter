"use server"
import { food, foodSchema, foodEatenToday, foodEatenTodaySchema, newFood, foodEatenTodayRecord, foodEatenTodayRecordSchema } from "@/types"
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

    const foodsFromSheets = response.data.values;

    if (foodsFromSheets === null || foodsFromSheets === undefined) throw new Error("nothing from sheets")

    const foodsFormatted: food[] = []

    foodsFromSheets.forEach((eachFoodRow, eachFoodRowIndex) => {
        //dont needx column names row
        if (eachFoodRowIndex === 0) return

        //name, image, calories, weightInGrams
        const foodFormmattedObj: food = {
            id: eachFoodRow[0],
            name: eachFoodRow[1],
            image: eachFoodRow[2],
            calories: parseFloat(eachFoodRow[3]),
            weightInGrams: parseFloat(eachFoodRow[4])
        }

        const verifiedFoodCheck = foodSchema.safeParse(foodFormmattedObj)
        if (verifiedFoodCheck.success) {
            foodsFormatted.push(verifiedFoodCheck.data)

        } else {
            console.log(`$couldn't add`, foodFormmattedObj);
        }
    })

    return foodsFormatted
}

export async function addFoodItem(foodItem: newFood) {
    const finalFoodObj: food = {
        id: uuidV4(),
        ...foodItem
    }

    await sheets.spreadsheets.values.append({
        spreadsheetId,
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
    const spreadRow = index + 1 + 1 //rows start at 1 + column name offset

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        // range: `${spreadRow}:${spreadRow}`,
        range: `foods!${spreadRow}:${spreadRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                [foodItem.id, foodItem.name, foodItem.image, foodItem.calories, foodItem.weightInGrams],
            ]
        }
    })

    console.log(`$worked to update`);
}













//food records
export async function getFoodsEatenToday() {
    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "eatenToday",
    });

    const foodsEatenTodayRecordsFromSheets = response.data.values;

    if (foodsEatenTodayRecordsFromSheets === null || foodsEatenTodayRecordsFromSheets === undefined) throw new Error("nothing from sheets")

    const foodRecordsFormatted: foodEatenTodayRecord[] = []

    foodsEatenTodayRecordsFromSheets.forEach((eachFoodRow, eachFoodRowIndex) => {
        //dont needx column names row
        if (eachFoodRowIndex === 0) return

        //name, image, calories, weightInGrams
        const foodRecordFormmattedObj: foodEatenTodayRecord = {
            foodId: eachFoodRow[0],
            quantity: parseFloat(eachFoodRow[1]),
            recordedWeight: parseFloat(eachFoodRow[2]),
        }

        const verifiedFoodCheck = foodEatenTodayRecordSchema.safeParse(foodRecordFormmattedObj)
        if (verifiedFoodCheck.success) {
            foodRecordsFormatted.push(verifiedFoodCheck.data)

        } else {
            console.log(`$couldn't add`, foodRecordFormmattedObj);
        }
    })


    const seenFoodItems = await getFoodItems()

    const foodsEatenToday: foodEatenToday[] = []

    foodRecordsFormatted.forEach(eachRecord => {
        seenFoodItems.forEach(eachFoodItem => {
            if (eachRecord.foodId === eachFoodItem.id) {
                const newFoodEatenToday: foodEatenToday = {
                    ...eachFoodItem,
                    quantity: eachRecord.quantity,
                    recordedWeight: eachRecord.recordedWeight
                }

                foodsEatenToday.push(newFoodEatenToday)
            }
        })
    })

    return foodsEatenToday
}

export async function addFoodEatenToday(foodEatenTodayRecord: foodEatenTodayRecord) {
    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "eatenToday",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
            values: [
                [foodEatenTodayRecord.foodId, foodEatenTodayRecord.quantity, foodEatenTodayRecord.recordedWeight],
            ]
        }
    })
}

export async function updateFoodEatenToday(foodEatenTodayRecord: foodEatenTodayRecord, index: number) {
    const spreadRow = index + 1 + 1 //rows start at 1 + column name offset

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `eatenToday!${spreadRow}:${spreadRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                [foodEatenTodayRecord.foodId, foodEatenTodayRecord.quantity, foodEatenTodayRecord.recordedWeight],
            ]
        }
    })
}




