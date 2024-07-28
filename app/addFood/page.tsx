"use client"
import React, { useState } from 'react'
import { defaultFoodImage } from '@/utility/globalState'
import { toast } from 'react-hot-toast'
import TextInput from '@/components/textInput/TextInput'
import styles from "./page.module.css"
import { newFoodSchema, newFood } from '@/types'
import Image from 'next/image'
import { appendGoogleSheetData } from '@/serverFunctions/handleApi'


export default function Page() {
  const initialForm: newFood = {
    name: "",
    image: "",
    calories: 0,
    weightInGrams: 0
  }

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
      const finalFoodObj = { ...formObj }
      if (finalFoodObj.image === "") finalFoodObj.image = defaultFoodImage

      if (!newFoodSchema.safeParse(finalFoodObj).success) return toast.error("Form not valid")

      // await addFoodItem(finalFoodObj)
      await appendGoogleSheetData(finalFoodObj)

      toast.success("Added food!")

      formObjSet({ ...initialForm })
    } catch (error) {
      toast.error("Couldn't Add")
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
            checkIfValid(formObj, "name", newFoodSchema)
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
            checkIfValid(formObj, "image", newFoodSchema)
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
            checkIfValid(formObj, "weightInGrams", newFoodSchema)
          }}
          errors={formErrors["weightInGrams"]}
        />

        <button disabled={!newFoodSchema.safeParse(formObj).success} type='submit' style={{ justifySelf: "flex-end", opacity: !newFoodSchema.safeParse(formObj).success ? ".6" : "", backgroundColor: "var(--primaryColor)", padding: '1rem 2rem', borderRadius: ".2rem", marginTop: '1rem' }}>Add Food</button>
      </form>
    </main>
  )
}
