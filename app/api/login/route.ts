import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const response = NextResponse.json({
    success: true,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },

        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },

        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 401 }
    )
  }

  return response
}