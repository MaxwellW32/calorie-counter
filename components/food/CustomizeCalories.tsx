"use client"
import { food, foodEatenToday, foodEatenTodayRecord } from '@/types'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from "./customizeCalories.module.css"
import { useAtom } from 'jotai'
import { addFoodEatenToday, getFoodsEatenToday, updateFoodEatenToday } from '@/serverFunctions/handleApi'
import { toast } from 'react-hot-toast'

export default function CustomizeCalories({ food }: { food: food }) {
    const [quantity, quantitySet] = useState(1)
    const [recordedWeight, recordedWeightSet] = useState(food.weightInGrams)
    const [maxRecordedWeight, maxRecordedWeightSet] = useState(recordedWeight + (recordedWeight / 2))
    const [minRecordedWeight, minRecordedWeightSet] = useState(recordedWeight - (recordedWeight / 2))

    const weightDebounce = useRef<NodeJS.Timeout>()

    const caloriesUsed = useMemo(() => {
        const caloriesPerGram = food.calories / food.weightInGrams
        return Math.floor(caloriesPerGram * recordedWeight) * quantity
    }, [food.calories, food.weightInGrams, recordedWeight, quantity])

    return (
        <div style={{ display: "grid", backgroundColor: "var(--gray2)", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <p>quantity:</p>

                <input type="number" value={quantity} placeholder='quantity' style={{ padding: "0", backgroundColor: "transparent", border: "none" }}
                    onChange={(e) => {
                        const parsedNum = parseFloat(e.target.value)

                        quantitySet(isNaN(parsedNum) ? 0 : parsedNum)
                    }}
                />
            </div>

            <p>Calories: {caloriesUsed}</p>
            <p>Weight {"(g)"}: {recordedWeight}</p>
            <p>Size: {(recordedWeight / food.weightInGrams).toFixed(2)}x</p>

            <input className={styles.slider} type="range" min={minRecordedWeight} max={maxRecordedWeight} value={recordedWeight}
                onChange={(e) => {
                    const currentWeightLocal = parseFloat(e.target.value)
                    recordedWeightSet(currentWeightLocal)

                    if (weightDebounce.current) clearTimeout(weightDebounce.current)
                    weightDebounce.current = setTimeout(() => {
                        if (currentWeightLocal === maxRecordedWeight) {
                            maxRecordedWeightSet(prev => {
                                return prev + (prev / 2)
                            })
                        }

                        if (currentWeightLocal === minRecordedWeight) {
                            minRecordedWeightSet(prev => {
                                let newMinVal = prev - (prev / 2)
                                if (newMinVal < 0) {
                                    newMinVal = 0
                                }
                                return newMinVal
                            })
                        }
                    }, 1000);
                }}
            />

            <button style={{ backgroundColor: "var(--color1)" }}
                onClick={async () => {
                    try {
                        const oldFoodsEatenToday: foodEatenToday[] = await getFoodsEatenToday()

                        const newFoodEatenTodayRecord: foodEatenTodayRecord = {
                            foodId: food.id,
                            quantity: quantity,
                            recordedWeight: recordedWeight
                        }

                        const foundInArrayIndex = oldFoodsEatenToday.findIndex(eachFood => eachFood.id === food.id)

                        if (foundInArrayIndex === -1) {
                            //new food item
                            await addFoodEatenToday(newFoodEatenTodayRecord)

                        } else {
                            //update old food item
                            await updateFoodEatenToday(newFoodEatenTodayRecord, foundInArrayIndex)
                            console.log(`$newFoodEatenTodayRecord`, newFoodEatenTodayRecord);
                        }

                        toast.success(`noted food`);

                    } catch (error) {
                        console.log(`$error adding foodeatentoday`);
                        toast.error("error noting food")
                    }
                }}
            >Add</button>
        </div>
    )
}
