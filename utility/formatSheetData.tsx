import { getFoodItems } from "@/serverFunctions/handleApi"
import { food, foodSchema } from "@/types"

export async function formatAndAddFoods() {
    //each outer array is row
    //each inner array is column data
    //first row has only column names

    const foodsFromSheets = await getFoodItems()
    if (foodsFromSheets === null || foodsFromSheets === undefined) return

    const foodsFormatted: food[] = []

    foodsFromSheets.forEach((eachFoodRow, eachFoodRowIndex) => {
        //dont needx column names row
        if (eachFoodRowIndex === 0) return

        //name, image, calories, weightInGrams
        const foodFormmattedObj: food = {
            id: eachFoodRow[0],
            name: eachFoodRow[1],
            image: eachFoodRowIndex === 12 ? null : eachFoodRow[2],
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