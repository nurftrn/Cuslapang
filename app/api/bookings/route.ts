import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ bookings: [] }, { status: 401 })
    }

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
        return NextResponse.json({ bookings: [] }, { status: 500 })
    }

    return NextResponse.json({ bookings: data || [] })
}
