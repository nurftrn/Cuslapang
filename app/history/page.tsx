"use client"

import { useEffect, useState, useOptimistic, startTransition } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function HistoryPage() {
const [bookings, setBookings] = useState<any[]>([])
const [loading, setLoading] = useState(true)
const [activeTab, setActiveTab] = useState("All")
const [optimisticBookings, setOptimisticBookings] =
   useOptimistic(
      bookings,
      (state, bookingId: number) =>
         state.filter((booking) => booking.id !== bookingId)
   )

const router = useRouter()

useEffect(() => {
   const fetchBookings = async () => {
      // Update status booking otomatis
      await fetch("/api/bookings/autoupdate", { method: "POST" });
      try {
         const res = await fetch("/api/bookings");
         if (!res.ok) {
            setBookings([]);
            setLoading(false);
            return;
         }
         const result = await res.json();
         setBookings(result.bookings || []);
      } catch (err) {
         setBookings([]);
      }
      setLoading(false);
   };
   fetchBookings();
}, []);

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

const handleCancelBooking = async (bookingId: number) => {
   startTransition(() => {
      setOptimisticBookings(bookingId)
   })

   const { error } = await supabase
      .from("bookings")
      .update({
         booking_status: "cancelled"
      })
      .eq("id", bookingId)

   if (error) {
      alert("Failed to cancel booking")
      console.log(error)
   } else {
      // sync real state
      setBookings((prev) =>
         prev.filter((booking) => booking.id !== bookingId)
      )
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
      {["All", "Waiting", "Completed", "Cancelled"].map((tab) => {
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
      {!loading && optimisticBookings.length === 0 && (
      <div className="bg-gray-50 rounded-2xl p-10 text-center text-gray-500">
         No booking history found.
      </div>
      )}

      {/* CARDS */}
      <div className="space-y-6">
      {optimisticBookings
         .filter((booking) => {
            if (activeTab === "All") return true

            return (
               booking.booking_status?.toLowerCase() ===
               activeTab.toLowerCase()
            )
         }).map((booking) => (

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
                     <div className="flex justify-between ">
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

                        <div>
                           {booking.booking_status?.toLowerCase() !== "cancelled" && booking.booking_status?.toLowerCase() !== "completed" && ( 
                              <button
                                 onClick={() => handleCancelBooking(booking.id)}
                                 className="mt-5 bg-red-100 text-red-500 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                                 >
                                 Cancel Booking
                              </button>
                           )}
                        </div>
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