"use client"
import React, { useState } from 'react'
import { getFoodItems } from '@/serverFunctions/handleApi'
import { food, foodSchema } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { defaultFoodImage } from '@/utility/globalState'
import { formatAndAddFoods } from '@/utility/formatSheetData'
import FoodSearchBar from '@/components/foodSearchBar/FoodSearchBar'

//convert calories per gram into item
// Record total calories per day - give reports
// Calories lost - lbs lost
//implement quality, and amount slider
//daily check - current/previous for streak
// Daily checker - current day/previous day checked 

//load up all foods ahead of time and store it
//use it in the search
export default function Page() {
  const [allFoodItems, allFoodItemsSet] = useState<food[]>([])

  return (
    <div>
      <Link href={`/addFood`}>
        <button>Add Food</button>
      </Link>

      <button onClick={async () => {
        const formattedFoods = await formatAndAddFoods()
        if (formattedFoods === undefined) return

        allFoodItemsSet(formattedFoods)
      }}>get foods</button>

      <FoodSearchBar allFoodItems={allFoodItems} />

      {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "1rem", padding: "1rem" }}>
        {allFoodItems.map(eachFood => {
          return (
            <div key={eachFood.id} style={{ display: "grid", gap: ".5rem", padding: '1rem', backgroundColor: "var(--gray1)", position: "relative" }}>
              <Link href={`editFood/${eachFood.id}`}>edit</Link>

              <div style={{ width: "min(300px, 100%)", aspectRatio: "1/1" }}>
                <Image height={300} width={300} alt={`${eachFood.name} image`} src={eachFood.image === "" ? defaultFoodImage : eachFood.image} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
              </div>

              <h2>{eachFood.name}</h2>
              <p>{eachFood.calories}cal</p>
              <p>{eachFood.weightInGrams}g</p>
            </div>
          )
        })}
      </div> */}
    </div>
  )
}
