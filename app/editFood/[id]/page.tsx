import AddUpdateFood from '@/components/food/AddUpdateFood';
import { formatAndAddFoods } from '@/utility/formatSheetData';
import React from 'react'

export default async function Page({ params }: { params: { id: string } }) {
    const formattedFoods = await formatAndAddFoods()
    if (formattedFoods === undefined) return <div>Error formatting foods</div>

    const foundFoodIndex = formattedFoods.findIndex(eachFood => eachFood.id === params.id)
    if (foundFoodIndex < 0) return <div>Couldn't find food</div>

    return (
        <main>
            <AddUpdateFood oldFoodItem={formattedFoods[foundFoodIndex]} oldFoodIndex={foundFoodIndex} />
        </main>
    )
}
