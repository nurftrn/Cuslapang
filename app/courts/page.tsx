"use client"

import { Suspense } from "react"

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

function CourtsContent() {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()

  const search = params.get("search") || ""
  const city = params.get("city") || "Unknown City"
  const sport = params.get("sport") || "Unknown Sport"

  const [courts, setCourts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourts = async () => {

      const { data, error } = await supabase
        .from("courts")
        .select(`
          *,
          sports (
            name,
            icon
          ),
          sport_centers (
            name,
            cities (
              name
            )
          )
        `)

      if (error) {
        console.log(error)
      } else {
        setCourts(data || [])
      }

      setLoading(false);
    }

    fetchCourts()

  }, [])

  // FILTER
  const filteredCourts = courts.filter((court) => {
    const courtCity =    court.sport_centers?.cities?.name
    const sameCity = !city || courtCity?.toLowerCase() === city.toLowerCase();
    const sameSport = !sport || court.sports?.name?.toLowerCase() === sport.toLowerCase();
    const sameSearch = !search || court.name?.toLowerCase().includes(search.toLowerCase())
    
    return sameCity && sameSport && sameSearch
  })

  const handleSearch = (value: string) => {
    const searchParams = new URLSearchParams(params)

    if (value) {
      searchParams.set("search", value)
    } else {
      searchParams.delete("search")
    }

    router.replace(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <div className="px-8 md:px-28 py-6">

      {/* TITLE */}
      <h1 className="text-xl font-bold mb-6">
        {sport.charAt(0).toUpperCase() + sport.slice(1)} Courts in {city.charAt(0).toUpperCase() + city.slice(1)}
      </h1>

      <input
        type="text"
        placeholder="Search courts..."
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border p-3 rounded-xl mb-6"
      />

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">
          Loading courts...
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-5">

        {filteredCourts.map((court) => (
          <div
            key={court.id}
            onClick={() => router.push(`/courts/${court.id}?city=${city}&sport=${sport}`)}
            className="group cursor-pointer rounded-2xl overflow-hidden shadow hover:shadow-lg transition hover:scale-[1.02]"
          >
            {/* IMAGE */}
            <div className="h-[160px] md:h-[200px] w-full">
              <img
                src={court.image_url}
                alt={court.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* INFO */}
            <div className="p-4">
              {/* BADGES */}
              <div className="flex gap-2 mb-3">
                <span className="bg-teal-100 text-black text-xs px-3 py-1 rounded-md">
                  {court.sports?.icon} {court.sports?.name}
                </span>

                <span className="bg-yellow-100 text-xs px-3 py-1 rounded-md">
                  📍 {court.sport_centers?.cities?.name}
                </span>
              </div>

              {/* NAME */}
              <h3 className="font-semibold text-lg">
                {court.name}
              </h3>

              {/* SPORT CENTER */}
              <p className="text-sm text-gray-500 mt-1">
                {court.sport_centers?.name}
              </p>

              {/* PRICE */}
              <p className="text-teal-600 font-semibold mt-4 text-right">
                Rp{court.price?.toLocaleString("id-ID")} / hour
              </p>
            </div>
          </div>
        ))}        
      </div>

      {/* NO COURTS AVAILABLE */}
      {!loading && filteredCourts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No courts available.
        </div>
      )}
    </div>
  )
}

export default function CourtsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourtsContent />
    </Suspense>
  )
}