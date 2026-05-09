"use client"

export const dynamic = "force-dynamic"

import { Suspense } from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

function CheckoutContent() {
  const params = useSearchParams()
  const router = useRouter()
  const time = params.get("time")
  const courtName = params.get("court")
  const date = params.get("date")
  const price = params.get("price")
  const courtId = params.get("courtId")

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  // Format date
  const selectedDate = date
    ? new Date(date)
    : new Date()

  const day = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  })

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Handle Copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("1234 5678 9012") // ntr ubah panggil va
      setCopied(true)

      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  // Payment
  const paymentMethods = [
    {
      type: "Bank Transfer",
      methods: ["BCA", "Mandiri"],
    },
    {
      type: "E-Wallet",
      methods: ["GoPay", "OVO", "DANA"],
    },
    {
      type: "QRIS",
      methods: ["QRIS"],
    },
  ]

  const getPaymentInfo = () => {
    if (selectedCategory === "QRIS") return "Scan QR Code"
    if (["GoPay", "OVO", "DANA"].includes(selectedPayment)) return "Use your phone number"
    if (selectedPayment === "BCA") return "1234 5678 9012"
    if (selectedPayment === "Mandiri") return "9876 5432 1098"
    return "-"
  }

  const handleBooking = async () => {
    if (!selectedPayment || !name || !phone) {
      alert("Please complete all fields")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("bookings")
      .insert([
        {
          court_id: Number(courtId),
          user_id: user.id,
          booking_date: date,
          start_time: time,
          duration: 1,
          user_name: name,
          phone: phone,
          payment_method: selectedPayment,
          payment_status: "pending",
          booking_status: "waiting",
          total_price: Number(price),
        },
      ])
    setLoading(false)

    if (error) {
      console.log(error)
      alert("Booking failed")
    } else {
      alert("Booking success!")
      router.push("/")
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()
  }, [])

  return (
    <div className="max-w-[1400px] mx-auto py-10 grid grid-cols-2 gap-8">

      {/* LEFT — BOOKING INFO */}
      <div className="bg-white rounded-2xl shadow p-6">

        <img
          src="/images/hero.jpeg"
          className="w-full h-50 object-cover rounded-xl mb-4"
        />

        <h2 className="text-xl font-bold mb-4">
          {courtName}
        </h2>

        {/* DETAIL */}
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-gray-500">Day</span>
          <span className="text-right font-medium">{day}</span>

          <span className="text-gray-500">Date</span>
          <span className="text-right font-medium">{formattedDate}</span>

          <span className="text-gray-500">Time</span>
          <span className="text-right font-medium">{time || "-"}</span>

          <span className="text-gray-500">Duration</span>
          <span className="text-right font-medium">60 Minutes</span>
        </div>

        {/* DIVIDER */}
        <div className="border-t my-5 border-black/50"></div>

        {/* TOTAL */}
        <div className="flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>Rp {Number(price)?.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* RIGHT — PAYMENT */}
      <div className="bg-white rounded-2xl shadow p-6">
        {/* INPUT USER */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3 mt-1"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-3 mt-1"
              placeholder="08xxxxxxxx"
            />
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <h2 className="text-lg font-semibold mb-4">
          Payment Method {user?.email}
        </h2>

        {/* CHOOSE CATEGORY */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {["Bank", "E-Wallet", "QRIS"].map((cat) => {
            const active = selectedCategory === cat            

            return (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  if (cat === "QRIS") {
                    setSelectedPayment("QRIS")
                  } else {
                    setSelectedPayment("")
                  }
                }}
                className={`p-4 rounded-xl text-center cursor-pointer border transition
                ${
                  active
                    ? "bg-teal-600 text-white "
                    : "border-gray-300 hover:border-teal-400"
                }`}
              >
                <p className="font-semibold">{cat}</p>
              </div>
            )
          })}
        </div>
        
        {/* BANK OPTIONS */}
        {selectedCategory === "Bank" && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {["BCA", "Mandiri"].map((method) => (
              <div
                key={method}
                onClick={() => setSelectedPayment(method)}
                className={`p-4 rounded-xl text-center border cursor-pointer
                ${
                  selectedPayment === method
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300"
                }`}
              >
                {method}
              </div>
            ))}
          </div>
        )}

        {/* E-WALLET OPTIONS */}
        {selectedCategory === "E-Wallet" && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {["GoPay", "OVO", "DANA"].map((method) => (
              <div
                key={method}
                onClick={() => setSelectedPayment(method)}
                className={`p-4 rounded-xl text-center border cursor-pointer
                ${
                  selectedPayment === method
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-300"
                }`}
              >
                {method}
              </div>
            ))}
          </div>
        )}

        {/* QRIS OPTIONS */}
        {selectedCategory === "QRIS" && (
          <div className="flex justify-center mb-4">
            <div className="text-center">

              <img
                src="/images/qris.png"
                alt="QRIS"
                className="w-40 h-40 object-contain mx-auto mb-3"
              />

              <p className="text-sm text-gray-500">
                Scan this QR code to pay
              </p>

            </div>
          </div>
        )}

        {/* VA */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">
            Virtual Account
          </label>

          <div className="flex justify-between items-center border border-gray-300 p-3 rounded-lg mt-1">
            <span>{getPaymentInfo()}</span>
            {selectedCategory !== "QRIS" && (
              <button
                className={`text-sm font-medium transition ${
                  copied
                    ? "text-green-600"
                    : "text-blue-500 hover:underline"
                }`}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
        </div>

        {/* BILL */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">
            Bill Amount
          </label>

          <div className="bg-red-100 text-red-600 p-3 rounded-lg mt-1 flex justify-between">
            <span>Rp {Number(price)?.toLocaleString("id-ID")}</span>
            <span className="text-sm">Unpaid</span>
          </div>
        </div>

        {/* ACTION */}
        <div className="space-y-3 mt-6">

          <button onClick={handleBooking} disabled={!selectedPayment || loading }
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-300"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <button
            disabled={!selectedPayment} className="w-full border py-3 rounded-lg hover:bg-gray-100"
          >
            Upload Proof
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}