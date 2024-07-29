import { food } from '@/types'
import React from 'react'
import Link from "next/link"
import Image from "next/image"
import styles from "./viewFood.module.css"

import { defaultFoodImage } from '@/utility/globalState'

export default function ViewFood({ food }: { food: food }) {

    return (
        <div style={{ display: "grid", gap: ".5rem", padding: '1rem', backgroundColor: "var(--gray1)", position: "relative" }}>
            <Link href={`editFood/${food.id}`} style={{ justifySelf: "flex-end" }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
            </Link>

            <div style={{ width: "min(300px, 100%)", aspectRatio: "1/1" }}>
                <Image height={300} width={300} alt={`${food.name} image`} src={food.image === "" ? defaultFoodImage : food.image} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
            </div>

            <h2>{food.name}</h2>
            <p>{food.calories}cal</p>
            <p>{food.weightInGrams}g</p>
        </div>
    )
}
