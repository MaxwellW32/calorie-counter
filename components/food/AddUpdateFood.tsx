"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { defaultFoodImage } from '@/utility/globalState'
import { toast } from 'react-hot-toast'
import TextInput from '@/components/textInput/TextInput'
import { newFoodSchema, newFood, food, foodSchema } from '@/types'
import Image from 'next/image'
import { addFoodItem, updateFoodItem } from '@/serverFunctions/handleApi'
import styles from "./addUpdateFood.module.css"

export default function AddUpdateFood({ oldFoodItem, oldFoodIndex }: { oldFoodItem?: food, oldFoodIndex?: number }) {
    const initialForm: food | newFood = oldFoodItem === undefined ? {
        name: "",
        image: "",
        calories: 0,
        weightInGrams: 0
    } : oldFoodItem

    const [formObj, formObjSet] = useState({ ...initialForm })

    type formKey = keyof newFood

    type inputElementType = "input" | "textArea" | "file"
    type acceptsType = "string" | "number"
    type moreFormInfo = Partial<{
        [key in formKey]: {
            label?: string,
            placeHolder?: string,
            inputElement?: inputElementType,
            accepts?: acceptsType,
            required?: boolean
        }
    }>

    const activeSchema = useMemo(() => {
        return oldFoodItem === undefined ? newFoodSchema : foodSchema
    }, [oldFoodItem])

    //load up old food if there
    useEffect(() => {
        if (oldFoodItem === undefined) return

        const oldToNewFood = activeSchema.parse(oldFoodItem)
        formObjSet(oldToNewFood)
    }, [])

    const [moreFormInfoObj,] = useState<moreFormInfo>({
        calories: {
            accepts: "number"
        },
        weightInGrams: {
            accepts: "number"
        }
    })

    const [formErrors, formErrorsSet] = useState<Partial<{
        [key in formKey]: string
    }>>({})

    function checkIfValid(seenFormObj: newFood, seenName: keyof newFood, schema: any) {
        const testSchema = schema.pick({ [seenName]: true }).safeParse(seenFormObj);

        if (testSchema.success) {//worked
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }
                delete newObj[seenName]
                return newObj
            })

        } else {
            formErrorsSet(prevObj => {
                const newObj = { ...prevObj }

                let errorMessage = ""

                JSON.parse(testSchema.error.message).forEach((eachErrorObj: any) => {
                    errorMessage += ` ${eachErrorObj.message}`
                })

                newObj[seenName] = errorMessage

                return newObj
            })
        }
    }

    const handleSubmit = async () => {
        try {
            if (oldFoodItem === undefined) {
                newFoodSchema.parse(formObj)

                //new food
                await addFoodItem(formObj)
                toast.success("Added food!")
                formObjSet({ ...initialForm })

            } else {
                //old food
                if (oldFoodIndex === undefined) throw new Error("index not provided")

                await updateFoodItem(foodSchema.parse(formObj), oldFoodIndex)
                toast.success("Updated food!")
            }

        } catch (error) {
            toast.error("Couldn't Add")
            console.log(`$error`, error);
        }
    }

    return (
        <main className={styles.main}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
                <div style={{ flex: "0 0 auto", width: "min(150px, 100%)", aspectRatio: "1/1", }}>
                    <Image alt='img' src={formObj.image === "" ? defaultFoodImage : formObj.image} width={200} height={200} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
                </div>

                <div style={{ flex: "0 0 300px" }}>
                    <p>Name: {formObj.name}</p>
                    <p>Calories: {formObj.calories}</p>
                    <p>Weight: {formObj.weightInGrams}</p>
                </div>
            </div>

            <form action={handleSubmit} className={styles.formDiv}>
                <TextInput
                    label='Enter Name'
                    name={"name"}
                    value={formObj["name"]}
                    placeHolder={"Enter name"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        formObjSet(prevObj => {
                            prevObj["name"] = e.target.value
                            return { ...prevObj }
                        })
                    }}
                    onBlur={() => {
                        checkIfValid(formObj, "name", activeSchema)
                    }}
                    errors={formErrors["name"]}
                />

                <TextInput
                    label='Enter Image Src'
                    name={"image"}
                    value={formObj["image"] ?? ""}
                    placeHolder={"Enter an image link"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        formObjSet(prevObj => {
                            prevObj["image"] = e.target.value

                            return { ...prevObj }
                        })
                    }}
                    onBlur={() => {
                        checkIfValid(formObj, "image", activeSchema)
                    }}
                    errors={formErrors["image"]}
                />

                <TextInput
                    label='Enter Calories'
                    name={"calories"}
                    value={`${formObj["calories"]}`}
                    placeHolder={"Enter calories"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        formObjSet(prevObj => {
                            const parsedNum = parseInt(e.target.value)
                            prevObj["calories"] = isNaN(parsedNum) ? 0 : parsedNum
                            return { ...prevObj }
                        })
                    }}
                    onBlur={() => {
                        checkIfValid(formObj, "calories", newFoodSchema)
                    }}
                    errors={formErrors["calories"]}
                />

                <TextInput
                    label='Enter Weight'
                    name={"weightInGrams"}
                    value={`${formObj["weightInGrams"]}`}
                    placeHolder={"Enter weight in grams"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        formObjSet(prevObj => {
                            const parsedNum = parseInt(e.target.value)
                            prevObj["weightInGrams"] = isNaN(parsedNum) ? 0 : parsedNum
                            return { ...prevObj }
                        })
                    }}
                    onBlur={() => {
                        checkIfValid(formObj, "weightInGrams", activeSchema)
                    }}
                    errors={formErrors["weightInGrams"]}
                />

                <button disabled={!activeSchema.safeParse(formObj).success} type='submit' style={{ justifySelf: "flex-end", opacity: !activeSchema.safeParse(formObj).success ? ".6" : "", backgroundColor: "var(--primaryColor)", padding: '1rem 2rem', borderRadius: ".2rem", marginTop: '1rem' }}>{oldFoodItem === undefined ? "Add Food" : "Update"}</button>
            </form>
        </main>
    )
}
