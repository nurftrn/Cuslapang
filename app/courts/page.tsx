"use client"

import { useRouter, useSearchParams } from "next/navigation";

export default function CourtsPage() {
  const router = useRouter()
  const params = useSearchParams()
  const city = params.get("city") || "Unknown City"
  const sport = params.get("sport") || "Unknown Sport"

  // belum pake supabase, jadi hardcode aja dulu
  const courts = [
    {
      id: 1,
      name: "Green Garden Football",
      category: "Football",
      city: "Cibiru",
      price: "Rp50.000",
      image: "/images/courts/football.jpg",
    },
    {
      id: 2,
      name: "Champion Badminton Hall",
      category: "Badminton",
      city: "Bandung",
      price: "Rp40.000",
      image: "/images/courts/badminton.jpg",
    },
    {
      id: 3,
      name: "Victory Basketball Court",
      category: "Basketball",
      city: "Cibiru",
      price: "Rp60.000",
      image: "/images/courts/basket.jpg",
    },
    {
      id: 4,
      name: "Champion Badminton Hall",
      category: "Badminton",
      city: "Bandung",
      price: "Rp40.000",
      image: "/images/courts/badminton.jpg",
    },
    {
      id: 5,
      name: "Champion Badminton Hall",
      category: "Badminton",
      city: "Bandung",
      price: "Rp40.000",
      image: "/images/courts/badminton.jpg",
    },
  ]

  const filteredCourts = courts.filter((court) => {
    return (
      (!city || court.city.toLowerCase() === city.toLowerCase()) &&
      (!sport || court.category.toLowerCase() === sport.toLowerCase())
    )
  })

  return (
    <div className="px-8 md:px-28 py-6">

      {/* TITLE */}
      <h1 className="text-xl font-bold mb-6">
        {sport.charAt(0).toUpperCase() + sport.slice(1)} Courts in {city?.charAt(0).toUpperCase() + city?.slice(1)}
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-5">

        {filteredCourts.map((court) => (
          <div
            key={court.id}
            onClick={() => router.push(`/courts/${court.id}?city=${city}&sport=${sport}`)}
            className="cursor-pointer rounded-2xl overflow-hidden shadow hover:shadow-lg transition hover:scale-[1.02]"
          >
            {/* IMAGE */}
            <div className="h-[160px] md:h-[200px] w-full">
              <img
                src={court.image}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="p-4">
              <h3 className="font-semibold text-base">
                {court.name}
              </h3>

              <p className="text-xs text-gray-500">
                {court.city}
              </p>

              <p className="text-green-600 font-medium mt-2 text-sm text-right">
                {court.price}
              </p>
            </div>
          </div>
        ))}
        
        {/* NO COURTS AVAILABLE */}
        {filteredCourts.length === 0 && (
          <p>No courts available in this area.</p>
        )}
      </div>
    </div>
  )
}
