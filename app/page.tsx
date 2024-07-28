"use client"
import React, { useState } from 'react'
import { getFoodItems, getGoogleSheetData } from '@/serverFunctions/handleApi'
import { food, foodSchema } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { defaultFoodImage } from '@/utility/globalState'

//create food obj type...
//accept new food obj...
//uses excel storage - fetches latest from sheet...
//stores new food records - syncs them to excel
//allow searching 
//convert calories per gram into item
// Record total calories per day - give reports
// Calories lost - lbs lost
//implement quality, and amount slider
//daily check - current/previous for streak
// Daily checker - current day/previous day checked 
export default function Page() {
  const [allFoods, allFoodsSet] = useState<food[]>([])

  async function formatAndAddFoods() {
    //each outer array is row
    //each inner array is column data
    //first row has only column names
    const foodsFromSheets = await getFoodItems()
    if (foodsFromSheets === undefined) return

    const foodValues = foodsFromSheets.values
    if (foodValues === null || foodValues === undefined) return

    const foodsFormatted: food[] = []

    foodValues.forEach((eachFoodRow, eachFoodRowIndex) => {
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
        console.log(`$verifiedFoodObj`, verifiedFoodCheck);
        foodsFormatted.push(verifiedFoodCheck.data)
      } else {
        console.log(`$couldn't add`, foodFormmattedObj);
      }
    })

    console.log(`$foodsFormatted`, foodsFormatted);
    allFoodsSet(foodsFormatted)
  }

  return (
    <div>
      <button onClick={async () => {
        const results = await getGoogleSheetData()
        console.log(`$results`, results);
      }}>test</button>

      <Link href={`/addFood`}>
        <button>Add Food</button>
      </Link>

      <button onClick={formatAndAddFoods}>get foods</button>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "1rem", padding: "1rem" }}>
        {allFoods.map(eachFood => {
          return (
            <div key={eachFood.id} style={{ display: "grid", gap: ".5rem", padding: '1rem', backgroundColor: "var(--gray1)" }}>
              <div style={{ width: "min(300px, 100%)", aspectRatio: "1/1" }}>
                <Image height={300} width={300} alt={`${eachFood.name} image`} src={eachFood.image === "" ? defaultFoodImage : eachFood.image} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
              </div>

              <h2>{eachFood.name}</h2>
              <p>{eachFood.calories}cal</p>
              <p>{eachFood.weightInGrams}g</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
