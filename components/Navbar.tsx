"use client"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full px-28 py-4 flex items-center justify-between bg-white shadow-sm rounded-xl">
      
      {/* LOGO */}
      <Link href="/" className="font-black text-xl text-teal-700 italic">
        CUSLAPANG
      </Link>

      {/* MENU */}
      <div className="flex gap-6 text-sm text-gray-600">
        <Link href="/">Home</Link>
        <Link href="#">Category</Link>
        <Link href="#">History</Link>
        <Link href="#">Contact</Link>
      </div>

      {/* ACTION */}
      <button className="bg-teal-700 text-white px-4 py-2 font-semibold rounded-full text-xs hover:bg-teal-800 transition">
        Sign Up
      </button>

    </nav>
  )
}