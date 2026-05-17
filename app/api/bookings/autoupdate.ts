import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
    const response = NextResponse.next()

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

    // Ambil semua bookings yang sudah lewat waktu sekarang dan statusnya bukan completed/cancelled
    const now = new Date()
    const nowDate = now.toISOString().slice(0, 10)
    const nowTime = now.toTimeString().slice(0, 5)

    // Ambil bookings yang sudah lewat
    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("id, booking_date, start_time, booking_status")
        .or(`booking_status.eq.waiting,booking_status.eq.upcoming`)

    if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    const toComplete = bookings.filter(b => {
        // booking_date < now, atau booking_date == now && start_time < now
        if (b.booking_date < nowDate) return true
        if (b.booking_date === nowDate && b.start_time < nowTime) return true
        return false
    })

    if (toComplete.length === 0) {
        return NextResponse.json({ success: true, updated: 0 })
    }

    // Update status ke completed
    const ids = toComplete.map(b => b.id)
    const { error: updateError } = await supabase
        .from("bookings")
        .update({ booking_status: "completed" })
        .in("id", ids)

    if (updateError) {
        return NextResponse.json({ success: false, message: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, updated: ids.length })
}
