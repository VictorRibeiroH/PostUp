import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"
import { z } from "zod"

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  platform: z.string().min(1),
  start_date: z.string().or(z.date()),
})

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const result = await query(
      `SELECT * FROM planner_events 
       WHERE user_id = $1 
       ORDER BY start_date ASC`,
      [user.id]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[SCHEDULED_POSTS_GET]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const body = await req.json()
    const validatedData = postSchema.parse(body)

    const result = await query(
      `INSERT INTO planner_events 
       (user_id, title, content, platform, start_date, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending') 
       RETURNING *`,
      [
        user.id,
        validatedData.title,
        validatedData.content,
        validatedData.platform,
        validatedData.start_date,
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Dados inválidos", { status: 400 })
    }

    console.error("[SCHEDULED_POSTS_POST]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
} 