import Z from "zod"

export const foodSchema = Z.object({
    id: Z.string().min(1),
    name: Z.string().min(1),
    image: Z.string(),
    calories: Z.number(),
    weightInGrams: Z.number(),
})
export type food = Z.infer<typeof foodSchema>

export const newFoodSchema = foodSchema.omit({ id: true })
export type newFood = Z.infer<typeof newFoodSchema>

