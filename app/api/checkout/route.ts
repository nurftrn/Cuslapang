import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
  const response = NextResponse.next()
  const body = await request.json()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, message: "Not logged in" }, { status: 401 })
  }

  const { courtId, date, time, name, phone, selectedPayment, price } = body

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

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
