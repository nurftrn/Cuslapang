"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const params = useSearchParams()
  const time = params.get("time")
  const courtName = params.get("court")
  const [loading, setLoading] = useState(false)

  return (
    <div className="px-60 py-10 grid grid-cols-2 gap-8">

      {/* LEFT — BOOKING INFO */}
      <div className="bg-white rounded-2xl shadow p-6">

        <img
          src="/images/hero.jpeg"
          className="w-full h-100 object-cover rounded-xl mb-4"
        />

        <h2 className="text-2xl font-bold mb-4">
          {courtName}
        </h2>

        <div className="space-y-3 text-md">

          <div className="flex justify-between">
            <span>Date</span>
            <span>Sunday, 12 April 2026</span>
          </div>

          <div className="flex justify-between">
            <span>Time</span>
            <span>{time}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>Rp180.000</span>
          </div>

        </div>
      </div>

      {/* RIGHT — PAYMENT */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-lg font-semibold mb-4">
          Payment Method
        </h2>

        {/* BANK OPTIONS */}
        <div className="flex gap-4 mb-6">

          <div className="flex-1 border border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-500">
            <p className="font-bold">BCA</p>
          </div>

          <div className="flex-1 border border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-500">
            <p className="font-bold">Mandiri</p>
          </div>

        </div>

        {/* VA */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">
            Virtual Account
          </label>

          <div className="flex justify-between items-center border border-gray-300 p-3 rounded-lg mt-1">
            <span>1234 5678 9012</span>
            <button className="text-blue-500 text-sm">
              Copy
            </button>
          </div>
        </div>

        {/* BILL */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">
            Bill Amount
          </label>

          <div className="bg-red-100 text-red-600 p-3 rounded-lg mt-1 flex justify-between">
            <span>Rp180.000</span>
            <span>Unpaid</span>
          </div>
        </div>

        {/* ACTION */}
        <div className="space-y-3 mt-6">

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Check Status
          </button>

          <button
            className="w-full border py-3 rounded-lg hover:bg-gray-100"
          >
            Upload Proof
          </button>
        </div>
      </div>
    </div>
  )
}