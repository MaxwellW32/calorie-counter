import Link from 'next/link'
import FoodSearchBar from '@/components/foodSearchBar/FoodSearchBar'

// Record total calories per day - give reports
// Calories lost - lbs lost
// Daily checker - current day/previous day checked 

export default async function Page() {

  return (
    <main>
      <Link href={`/addFood`}>
        <button>Add Food</button>
      </Link>

      <FoodSearchBar />
    </main>
  )
}
