"use client"
import { food } from '@/types'
import React, { useMemo, useState } from 'react'
import styles from "./customizeCalories.module.css"

export default function CustomizeCalories({ food }: { food: food }) {
    const [currentWeight, currentWeightSet] = useState(food.weightInGrams)
    const [quantity, quantitySet] = useState(1)

    const caloriesUsed = useMemo(() => {
        const caloriesPerGram = food.calories / food.weightInGrams
        return Math.floor(caloriesPerGram * currentWeight * quantity)
    }, [food.calories, food.weightInGrams, currentWeight, quantity])

    const minRangeValue = food.weightInGrams - (food.weightInGrams / 2)

    return (
        <div style={{ display: "grid" }}>
            <input className={styles.slider} type="range" min={minRangeValue < 0 ? 0 : minRangeValue} max={food.weightInGrams + (food.weightInGrams / 2)} value={currentWeight}
                onChange={(e) => {
                    currentWeightSet(parseFloat(e.target.value))
                }}
            />

            <input type="number" value={quantity} placeholder='quantity' style={{}}
                onChange={(e) => {
                    const parsedNum = parseFloat(e.target.value)

                    quantitySet(isNaN(parsedNum) ? 0 : parsedNum)
                }}
            />

            {quantity > 1 && <p>{quantity}x</p>}
            <p>Calories: {caloriesUsed}</p>
            <p>Weight {"(g)"}: {currentWeight * quantity}</p>
        </div>
    )
}
