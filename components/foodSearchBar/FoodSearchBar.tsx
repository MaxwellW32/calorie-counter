"use client"
import { food } from '@/types'
import React, { useMemo, useState } from 'react'
import ViewFood from '../food/ViewFood'
import CustomizeCalories from '../food/CustomizeCalories'

export default function FoodSearchBar({ allFoodItems }: { allFoodItems: food[] }) {
    const [search, searchSet] = useState("")

    const filteredFoodItems = useMemo(() => {
        if (search === "") return []

        return allFoodItems.filter(eachFoodItem => eachFoodItem.name.toLowerCase().includes(search.toLowerCase()))
    }, [search, allFoodItems])

    return (
        <div style={{ display: "grid" }}>
            <input type='text' value={search} placeholder="Today's eats"
                onChange={(e) => {
                    searchSet(e.target.value)
                }}
            />

            <div style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "min(200px, 100%)", gap: "1rem", overflowX: "auto" }}>
                {filteredFoodItems.map(eachFood => {
                    return (
                        <div key={eachFood.id} style={{ display: "grid" }}>
                            <CustomizeCalories food={eachFood} />

                            <ViewFood food={eachFood} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
