"use client"

import { supabase } from "@/lib/supabase"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function CourtDetail() {
  const params = useParams()
  const paramsSearch = useSearchParams();
  const router = useRouter()
  
  const courtId = Number(params.id)

  const sport = paramsSearch.get("sport");
  const city = paramsSearch.get("city");

  const [court, setCourt] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

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

  const defaultTimes = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ]

  const generateSessions = () => {
    if (!court?.open_hours) return []

    const [open, close] =
      court.open_hours.split(" - ")

    const openHour = Number(open.split(":")[0])
    const closeHour = Number(close.split(":")[0])

    const times = []

    for (let hour = openHour; hour < closeHour; hour++) {
      times.push(
        `${hour.toString().padStart(2, "0")}:00`
      )
    }

    return times
  }

  const isBooked = (time: string) => {
    return bookings.some(
      (booking) =>
        booking.start_time?.slice(0, 5) === time
    )
  }

  useEffect(() => {
    if (!courtId) return
    const fetchCourt = async () => {
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
        .eq("id", courtId)
        .single()

      if (error) {
        console.log("FETCH COURT ERROR:", error)
      } else {
        console.log("COURT DATA:", data)
        setCourt(data)
      }
      setLoading(false)
    }
    fetchCourt()
  }, [courtId])

  useEffect(() => {
    if (!selectedDate) return
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("court_id", courtId)
        .eq("booking_date", selectedDate)

      if (error) {
        console.log(error)
      } else {
        setBookings(data || [])
      }
    }
    fetchBookings()
  }, [selectedDate, courtId])

  // LOADING
  if (loading) {
    return (
      <div className="px-8 md:px-28 py-10">
        Loading court...
      </div>
    )
  }

  // NOT FOUND
  if (!court) {
    return (
      <div className="px-8 md:px-28 py-10">
        Court not found.
      </div>
    )
  }  

  return (
    <div className="px-8 md:px-28 py-6">

      {/* HERO */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden">
        <img src={court.image_url} alt={court.name} className="w-full h-full object-cover"/>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-6 text-white">
          <div className="w-full">
            {/* BADGES */}
            <div className="mb-3 flex gap-2">            
              {sport && (
                <span className="px-3 py-1 text-xs text-teal-700 font-medium bg-teal-100 rounded-md">
                  {court.sports?.icon} {court.sports?.name}
                </span>
              )}

              {city && (
                <span className="px-3 py-1 text-xs text-yellow-700 font-medium bg-yellow-100 rounded-md">
                  📍 {court.sport_centers?.cities?.name}
                </span>
              )}
            </div>

            {/* TITLE */}
            <h1 className="text-5xl font-bold mb-2">{court.name} - {court.sport_centers?.name}</h1>
            <p className="max-w-xl text-sm opacity-90 mb-4">{court.description}</p>
          </div>

          {/* INFO GRID */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white-200">
            {/* LOCATION */}
            <div>
              <h4 className="font-semibold">Location</h4>
              <p className="text-sm text-white opacity-90">
                {court.location}
              </p>
            </div>

            {/* FACILITIES */}
            <div>
              <h4 className="font-semibold">Facilities</h4>
              <ul className="space-y-2 text-sm text-white opacity-90">
                {court.facilities?.map((facilities: string, i: number) => (
                  <li key={i}> 
                    • {facilities}
                  </li>
                ))}
              </ul>
            </div>

            {/* RULES */}
            <div>
              <h4 className="font-semibold">Rules</h4>
              <ul className="space-y-2 text-sm text-white opacity-90">
                {court.rules?.map((rule: string, i: number) => (
                  <li key={i}> 
                    • {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* HOURS */}
            <div>
              <h4 className="font-semibold">Open Hours</h4>
              <p className="text-sm text-white opacity-90">
                {court.open_hours}
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
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {generateSessions().map((time, i) => {
              const booked = isBooked(time)
              const active = selectedTime === time

              return (
                <button
                  key={i}
                  disabled={booked}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    p-4 rounded-xl border transition text-center
                    ${
                      active
                        ? "bg-teal-600 text-teal-700 border-teal-600"
                        : ""
                    }
                    ${
                      booked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:border-teal-400 bg-white"
                    }
                  `}
                >
                  <p className="text-xs mb-2">
                    60 Minutes
                  </p>
                  <h3 className="font-bold text-lg">
                    {time}
                  </h3>
                  <p className="text-sm mt-2">
                    Rp {court.price?.toLocaleString("id-ID")}
                  </p>
                </button>
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
            Rp {court.price?.toLocaleString("id-ID")}
          </div>

          <button disabled={!selectedTime || !selectedDate} onClick={() => 
            router.push(`/checkout?court=${court.name}&time=${selectedTime}&date=${selectedDate}&price=${court.price}&courtId=${court.id}`)}
            className={`w-full py-3 rounded-lg text-white text-base transition ${ selectedTime ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-300 cursor-not-allowed" }`}>
            Book Schedule →
          </button>
        </div>
      </div>
    </div>
  )
}