import AddUpdateFood from '@/components/food/AddUpdateFood';
import { getFoodItems } from '@/serverFunctions/handleApi';
import { food } from '@/types';
import React from 'react'
import { toast } from 'react-hot-toast';

// async function checkAndDisplayErrors<T>(functionToCall: () => Promise<T>){
//         return await functionToCall()
// }

export default async function Page({ params }: { params: { id: string } }) {
    let foodItems: food[] = []

    try {
        foodItems = await getFoodItems()
    } catch (error) {
        toast.error("couldn't get food items")
        console.log(`$couldn't get food items`, error);
    }

    const foundFoodIndex = foodItems.findIndex(eachFood => eachFood.id === params.id)
    if (foundFoodIndex < 0) return <div>Couldn&apos;t find food</div>

    return (
        <main>
            <AddUpdateFood oldFoodItem={foodItems[foundFoodIndex]} oldFoodIndex={foundFoodIndex} />
        </main>
    )
}
