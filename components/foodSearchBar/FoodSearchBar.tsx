"use client"
import { food } from '@/types'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import ViewFood from '../food/ViewFood'
import CustomizeCalories from '../food/CustomizeCalories'
import { toast } from 'react-hot-toast'
import { getFoodItems } from '@/serverFunctions/handleApi'

const defaultAllFoods: food[] = [
    {
        "id": "5ed50a66-9ea8-4a84-be1a-2779178dff98",
        "name": "Tuna",
        "image": "",
        "calories": 240,
        "weightInGrams": 140
    },
    {
        "id": "a553858a-116f-43ee-ace8-cec8b6f4c0e5",
        "name": "Mackerel",
        "image": "",
        "calories": 140,
        "weightInGrams": 85
    },
    {
        "id": "b83ecfb8-91fb-4194-b79e-041c23e2c635",
        "name": "1 mug rice uncooked",
        "image": "",
        "calories": 700,
        "weightInGrams": 185
    },
    {
        "id": "b0260c44-f683-44df-9804-38d56d3e82e9",
        "name": "1 mug rice cooked",
        "image": "",
        "calories": 200,
        "weightInGrams": 185
    },
    {
        "id": "df46693a-9d3c-4fa0-9ca8-66c368b907e4",
        "name": "1 egg",
        "image": "",
        "calories": 78,
        "weightInGrams": 50
    },
    {
        "id": "0552a2d4-7714-4a22-940b-fd7571bac8a6",
        "name": "Otaheite apple",
        "image": "",
        "calories": 50,
        "weightInGrams": 100
    },
    {
        "id": "59ee55f5-c0d6-44df-a713-35425ffe531a",
        "name": "Banana",
        "image": "",
        "calories": 89,
        "weightInGrams": 118
    },
    {
        "id": "6c4caac9-9462-4d26-baab-ca8e84ea54b5",
        "name": "1 cup flour",
        "image": "",
        "calories": 455,
        "weightInGrams": 120
    },
    {
        "id": "16434459-bb46-4932-ba7a-6b380fab60fc",
        "name": "1 chicken thigh",
        "image": "",
        "calories": 180,
        "weightInGrams": 150
    },
    {
        "id": "b361befc-e898-4369-849d-288db13c6267",
        "name": "1 chicken leg",
        "image": "",
        "calories": 172,
        "weightInGrams": 100
    },
    {
        "id": "b8b372e2-8823-47bd-94b3-294a3bf878f6",
        "name": "1 chicken breast",
        "image": "",
        "calories": 149,
        "weightInGrams": 85
    },
    {
        "id": "b06fbe09-da54-4adf-8dc3-01aca9a3005d",
        "name": "1 chicken wing",
        "image": "",
        "calories": 80,
        "weightInGrams": 30
    },
    {
        "id": "1e1a6402-8997-40ab-b270-b7c4e8f4d47b",
        "name": "1 small block of cheese",
        "image": "",
        "calories": 54,
        "weightInGrams": 15
    },
    {
        "id": "44e4f400-0725-4f9e-868f-488b6ccce337",
        "name": "1 bulla",
        "image": "",
        "calories": 154,
        "weightInGrams": 50
    },
    {
        "id": "48760328-b4c0-4690-9a74-39bd8ce88ffe",
        "name": "1 bun",
        "image": "",
        "calories": 480,
        "weightInGrams": 150
    },
    {
        "id": "c302db30-7200-4ab2-99cd-a75b003c353c",
        "name": "1 orange",
        "image": "",
        "calories": 47,
        "weightInGrams": 130
    },
    {
        "id": "f03dea73-3286-4d84-bb3c-af32fafa5b3d",
        "name": "1 tbsp sugar",
        "image": "",
        "calories": 48,
        "weightInGrams": 12.5
    },
    {
        "id": "59722357-7704-42ec-849d-e0ba27fbf171",
        "name": "1 soup mix",
        "image": "",
        "calories": 50,
        "weightInGrams": 10
    },
    {
        "id": "6f1d14bd-60ad-45b1-9553-52cf0eb2a054",
        "name": "1 potato",
        "image": "",
        "calories": 110,
        "weightInGrams": 150
    },
    {
        "id": "fb25ff6d-dc97-4f8f-a779-a40ac29355eb",
        "name": "1 sweet potato",
        "image": "",
        "calories": 112,
        "weightInGrams": 130
    },
    {
        "id": "97cdfa5c-9e1a-41b5-935f-7db9f5428ad8",
        "name": "1 yam",
        "image": "",
        "calories": 118,
        "weightInGrams": 130
    },
    {
        "id": "9bcf0519-30ba-45f4-ab8a-c6fe9266024e",
        "name": "1 fish",
        "image": "",
        "calories": 200,
        "weightInGrams": 150
    },
    {
        "id": "3e3ca45c-bc93-4a88-8316-86ea89ab2e9d",
        "name": "1 pineapple slice",
        "image": "",
        "calories": 42,
        "weightInGrams": 80
    },
    {
        "id": "ed4e8d3a-eb7f-493c-a22a-d9d35e21e764",
        "name": "1 apple",
        "image": "",
        "calories": 52,
        "weightInGrams": 100
    },
    {
        "id": "f0a405fd-d9d1-46f2-80e6-48c4c20dc3de",
        "name": "2 slices whole wheat bread",
        "image": "",
        "calories": 150,
        "weightInGrams": 60
    },
    {
        "id": "3d8ca8d7-619a-4ab8-bd8c-7785bd81c681",
        "name": "1 caramel popcorn",
        "image": "",
        "calories": 120,
        "weightInGrams": 30
    },
    {
        "id": "4db6b9f1-78af-4fb2-a734-f7214b67df41",
        "name": "1 bridge wafer",
        "image": "",
        "calories": 160,
        "weightInGrams": 40
    },
    {
        "id": "b1380b9e-f443-4ace-aeba-69069c3eff4e",
        "name": "1 pack spaghetti",
        "image": "",
        "calories": 1432,
        "weightInGrams": 500
    },
    {
        "id": "2b3e8c90-af8b-4fc3-b906-2a48b0decc32",
        "name": "1 serving cereal",
        "image": "",
        "calories": 120,
        "weightInGrams": 30
    },
    {
        "id": "d7cf818b-4d6b-44ba-a7b6-1500134f77e7",
        "name": "1 cup lasco",
        "image": "",
        "calories": 180,
        "weightInGrams": 200
    },
    {
        "id": "b5652876-49ea-401b-aa05-260ed0d96c81",
        "name": "1 bulla",
        "image": "",
        "calories": 150,
        "weightInGrams": 50
    },
    {
        "id": "a2c7ac04-9ed6-4c9d-a218-383182724094",
        "name": "1 mango",
        "image": "",
        "calories": 200,
        "weightInGrams": 200
    },
    {
        "id": "cb83c359-dceb-400f-8969-704baf57fdfe",
        "name": "1 cracker",
        "image": "",
        "calories": 16,
        "weightInGrams": 4
    },
    {
        "id": "17132142-7017-470b-a41c-ad1d1b2bc39a",
        "name": "1 water cracker",
        "image": "",
        "calories": 13,
        "weightInGrams": 3
    },
    {
        "id": "7ac270aa-7f5d-47d3-b184-90bb7dc73bab",
        "name": "1 beef (100g)",
        "image": "",
        "calories": 250,
        "weightInGrams": 100
    },
    {
        "id": "2a230663-c849-46a0-ab51-cd2ed6967c8b",
        "name": "1 festival",
        "image": "",
        "calories": 111,
        "weightInGrams": 50
    },
    {
        "id": "4d872124-7505-4095-8209-56e8f3824920",
        "name": "1 sugar cane",
        "image": "",
        "calories": 40,
        "weightInGrams": 20
    },
    {
        "id": "52e7a1db-9b57-4fbd-a0e4-91d66fa81c77",
        "name": "max",
        "image": "",
        "calories": 0,
        "weightInGrams": 0
    },
    {
        "id": "e0d1504e-4f3d-42f6-909b-8a3c06a09ec4",
        "name": "twice",
        "image": "",
        "calories": 0,
        "weightInGrams": 0
    },
    {
        "id": "8035105a-cdbd-40d1-b59d-b489245e4403",
        "name": "golden",
        "image": "",
        "calories": 12,
        "weightInGrams": 20
    },
    {
        "id": "3ab4585f-6b71-4a32-bab5-a0e83ee7fb30",
        "name": "as,as",
        "image": "https://static.vecteezy.com/system/resources/previews/005/007/528/large_2x/restaurant-food-kitchen-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg",
        "calories": 0,
        "weightInGrams": 0
    }
]

export default function FoodSearchBar() {
    const [search, searchSet] = useState("")
    const searchDebounce = useRef<NodeJS.Timeout>()
    const [allFoodItems, allFoodItemsSet] = useState<food[]>([])

    //get food items once
    useEffect(() => {
        loadFoods()
    }, [])

    async function loadFoods() {
        try {
            const allFoodItems = [...defaultAllFoods]
            // const allFoodItems = await getFoodItems()

            if (allFoodItems === undefined) {
                toast.error("couldn't get food items")
                return
            }

            allFoodItemsSet(allFoodItems)

        } catch (error) {
            toast.error("error loading items")
            console.log(`$error loading items`, error);
        }
    }

    const foundFoodItems = useMemo(() => {
        if (search === "") return []

        return allFoodItems.filter(eachFoodItem => eachFoodItem.name.toLowerCase().includes(search.toLowerCase()))
    }, [search, allFoodItems])

    return (
        <div style={{ display: "grid" }}>
            <input type='text' value={search} placeholder="Today's eats"
                onChange={(e) => {
                    searchSet(e.target.value)

                    if (searchDebounce.current) clearTimeout(searchDebounce.current)

                    if (e.target.value === "") return

                    searchDebounce.current = setTimeout(() => {
                        loadFoods()
                    }, 1000);
                }}
            />

            <div className='snap' style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "300px", gap: "1rem", overflowX: "auto" }}>
                {foundFoodItems.map(eachFood => {
                    return (
                        <div key={eachFood.id} style={{ display: "grid" }}>
                            <ViewFood food={eachFood} />

                            <CustomizeCalories food={eachFood} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
