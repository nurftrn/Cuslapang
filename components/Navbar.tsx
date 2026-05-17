"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error)
      alert("Logout failed")
      return
    }

    router.replace("/login")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 w-full px-8 md:px-28 py-4 flex items-center justify-between bg-white shadow-sm rounded-xl">
      
      {/* LOGO */}
      <Link href="/" className="font-black text-xl text-teal-700 italic">
        CUSLAPANG
      </Link>

      {/* MENU */}
      <div className="flex gap-6 text-sm text-gray-600">
        <Link href="/">Home</Link>
        <Link href="#">Category</Link>
        <Link href="/history">History</Link>
        <Link href="#">Contact</Link>
      </div>

      {/* ACTION */}
      {user ? (
        <div className="relative group">
          
          {/* PROFILE CIRCLE */}
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold cursor-pointer uppercase">
            {user.email?.charAt(0)}
          </div>

          {/* DROPDOWN */}
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            
            <div className="px-4 py-3 border-b">
              <p className="text-xs text-gray-500">
                Signed in as
              </p>

              <p className="text-sm font-medium truncate">
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-500 rounded-b-xl"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <Link href="/signup">
          <button className="bg-teal-700 text-white px-4 py-2 font-semibold rounded-full text-xs hover:bg-teal-800 transition">
            Sign Up
          </button>
        </Link>
      )}
    </nav>
  )
}