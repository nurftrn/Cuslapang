"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function HistoryPage() {
const [bookings, setBookings] = useState<any[]>([])
const [loading, setLoading] = useState(true)
const [activeTab, setActiveTab] = useState("All")

useEffect(() => {
   const fetchBookings = async () => {
      // GET USER
      const {
      data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
      setLoading(false)
      return
      }

      // GET BOOKINGS
      const { data, error } = await supabase
      .from("bookings")
      .select(`
         *,
         courts (
            name,
            image_url,
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
         )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

      if (error) {
      console.log(error)
      } else {
      setBookings(data || [])
      }

      setLoading(false)
   }

   fetchBookings()
}, [])

// FILTER
const filteredBookings = bookings.filter((booking) => {
   if (activeTab === "All") return true

   return (
      booking.booking_status?.toLowerCase() ===
      activeTab.toLowerCase()
   )
})

const getStatusColor = (status: string) => {
   switch (status?.toLowerCase()) {
      case "completed":
      return "bg-green-100 text-green-700"

      case "upcoming":
      return "bg-blue-100 text-blue-700"

      case "cancelled":
      return "bg-red-100 text-red-700"

      default:
      return "bg-yellow-100 text-yellow-700"
   }
}

return (
   <div className="px-8 md:px-28 py-10">

      {/* TITLE */}
      <h1 className="text-5xl font-bold mb-3">
      My Booking History
      </h1>

      <p className="text-gray-500 mb-8 text-lg">
      List of all sports field bookings you have made.
      </p>

      {/* FILTER */}
      <div className="flex gap-4 mb-10 flex-wrap">
      {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => {
         const active = activeTab === tab

         return (
            <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full border transition font-medium
            ${
               active
                  ? "bg-teal-600 text-white border-teal-600"
                  : "border-teal-600 text-teal-600 hover:bg-teal-50"
            }`}
            >
            {tab}
            </button>
         )
      })}
      </div>

      {/* LOADING */}
      {loading && (
      <p className="text-gray-500">
         Loading bookings...
      </p>
      )}

      {/* EMPTY */}
      {!loading && filteredBookings.length === 0 && (
      <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-500">
         No booking history found.
      </div>
      )}

      {/* CARDS */}
      <div className="space-y-6">
      {filteredBookings.map((booking) => (
         <div
            key={booking.id}
            className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition"
         >
            <div className="flex flex-col lg:flex-row">
            {/* IMAGE */}
               <div className="lg:w-[320px] h-[250px]">
                  <img
                     src={booking.courts?.image_url}
                     alt={booking.courts?.name}
                     className="w-full h-full object-cover"
                  />
               </div>

               {/* CONTENT */}
               <div className="flex-1 p-7 flex flex-col justify-between">
                  {/* TOP */}
                  <div>
                     {/* DATE + STATUS */}
                     <div className="flex items-center gap-3 mb-4 flex-wrap">

                        <p className="text-gray-500">
                           {new Date(
                              booking.booking_date
                           ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                           })}
                        </p>

                        <span
                           className={`px-3 py-1 rounded-full text-sm font-medium
                           ${getStatusColor(booking.booking_status)}`}
                        >
                           {booking.booking_status}
                        </span>
                        </div>

                        {/* TITLE */}
                        <h2 className="text-3xl font-bold mb-3">
                        {booking.courts?.name}
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="text-gray-600 mb-5 max-w-3xl">
                        Booking for {booking.courts?.sports?.name} session at{" "}
                        {booking.courts?.sport_centers?.name}.
                        </p>

                        {/* INFO */}
                        <div className="flex flex-wrap gap-4 text-sm">

                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                           {booking.courts?.sports?.icon}{" "}
                           {booking.courts?.sports?.name}
                        </div>

                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                           ⏰ {booking.start_time?.slice(0, 5)}
                        </div>

                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                           📍{" "}
                           {
                              booking.courts?.sport_centers?.cities
                              ?.name
                           }
                        </div>

                        <div className="bg-gray-100 px-4 py-2 rounded-full">
                           💳 {booking.payment_status}
                        </div>
                        {/* BUTTONS */}
                        {/* <div className="flex gap-4 justify-end mt-8 flex-wrap">
                           <button
                           className="border border-teal-600 text-teal-600 px-5 py-3 rounded-full hover:bg-teal-50 transition"
                           >
                           View Detail
                           </button>

                           <button
                           className="bg-teal-600 text-white px-5 py-3 rounded-full hover:bg-teal-700 transition"
                           >
                           Download Receipt
                           </button>
                        </div> */}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      ))}
      </div>
   </div>
)
}