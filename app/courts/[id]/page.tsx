"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function CourtDetail() {
  const params = useParams()
  const paramsSearch = useSearchParams();
  const router = useRouter()
  const sport = paramsSearch.get("sport");
  const city = paramsSearch.get("city");

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const courtId = params.id

  // belum pake supabase, jadi hardcode aja dulu
  const court = {
    id: courtId,
    name: "Green Garden Futsal",
    description: "A well-maintained futsal court with artificial turf, located in the heart of the city. Perfect for both casual games and competitive matches.",
    location: "Cibiru",
    price: 50000,
    image: "/images/hero.jpeg",
  }

  const schedules = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ]

  const formatDate = (dateString: string): string => {
    if (!dateString) return ""

    const date = new Date(dateString)

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="px-60 py-6">

      {/* HERO */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden mb-2">
        <img src={court.image} className="w-full h-full object-cover"/>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-6 text-white">
          <div className="w-full">
            <div className="mb-3 flex gap-2">            
              {sport && (
                <span className="px-3 py-1 text-xs text-teal-700 font-medium bg-teal-100 rounded-md">
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </span>
              )}

              {city && (
                <span className="px-3 py-1 text-xs text-yellow-700 font-medium bg-yellow-100 rounded-md">
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </span>
              )}
            </div>
            <h1 className="text-5xl font-bold mb-2">{court.name}</h1>
            <p className="max-w-xl text-sm opacity-90 mb-4">{court.description}</p>
          </div>
            {/* INFO GRID */}
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white-200">

              {/* LOCATION */}
              <div>
                <h4 className="font-semibold">Location</h4>
                <p className="text-sm text-white opacity-90">
                  Jl. Cibiru No.123, Bandung
                </p>
              </div>

              {/* FACILITIES */}
              <div>
                <h4 className="font-semibold">Facilities</h4>
                <ul className="text-sm text-white opacity-90">
                  <li>• Parking Area</li>
                  <li>• Toilet</li>
                  <li>• Changing Room</li>
                </ul>
              </div>

              {/* RULES */}
              <div>
                <h4 className="font-semibold">Rules</h4>
                <ul className="text-sm text-white opacity-90">
                  <li>• No smoking</li>
                  <li>• Max 10 players</li>
                </ul>
              </div>

              {/* HOURS */}
              <div>
                <h4 className="font-semibold">Open Hours</h4>
                <p className="text-sm text-white opacity-90">
                  08:00 - 22:00
                </p>
              </div>
            </div>
        </div>
      </div>


      {/* CONTENT */}
      <div className="mx-auto py-10 grid grid-cols-3 gap-8">

        {/* LEFT (2 COL) */}
        <div className="col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-6">
              Schedule Available
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-3 rounded-lg mb-6 text-sm"
              />
            </div>
          
          {/* SCHEDULE */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {schedules.map((time, i) => {
              const active = selectedTime === time

              return (
                <div
                  key={i}
                  onClick={() => setSelectedTime(time)}
                  className={`p-4 rounded-xl cursor-pointer transition border
                  ${
                    active
                      ? "bg-teal-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 shadow-md transition-all duration-200"
                  }`}
                >
                  <p className="text-xs mb-2">60 Minutes</p>
                  <h3 className="font-bold text-lg">{time}</h3>
                  <p className="text-sm mt-2">Rp180.000</p>
                </div>
              )
            })}

          </div>
        </div>

        {/* RIGHT (BOOKING PANEL) */}
        <div className="bg-white shadow-lg rounded-2xl p-6 h-fit sticky top-24">

          <h3 className="font-semibold mb-4 text-center">
            Booking Summary
          </h3>

          <div className="mb-4 text-sm grid grid-cols-2 gap-y-2">
            <span className="text-gray-500">Day</span>
            <span className="font-medium text-right">
              {formatDate(selectedDate).split(",")[0]}
            </span>

            <span className="text-gray-500">Date</span>
            <span className="font-medium text-right">
              {formatDate(selectedDate).split(",").slice(1).join(",")}
            </span>

            <span className="text-gray-500">Time</span>
            <span className="font-medium text-right">
              {selectedTime || "-"}
            </span>

            <span className="text-gray-500">Duration</span>
            <span className="font-medium text-right">
              60 Minutes
            </span>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg mb-4 text-center font-semibold">
            Rp180.000
          </div>

          <button disabled={!selectedTime || !selectedDate} onClick={() => router.push( `/checkout?court=${court.name}&time=${selectedTime}`)}
            className={`w-full py-3 rounded-lg text-white transition ${ selectedTime ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-300 cursor-not-allowed" }`}>
            Book Schedule →
          </button>
        </div>

      </div>
    </div>
  )
}