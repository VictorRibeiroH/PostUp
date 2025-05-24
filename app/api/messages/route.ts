import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const result = await query(
      `SELECT * FROM messages 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user.id]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[MESSAGES_GET]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
} 