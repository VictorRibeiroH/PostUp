import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"
import * as z from "zod"

const campaignSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  platform: z.string().min(1, "A plataforma é obrigatória"),
  budget: z.number().min(1, "O orçamento deve ser maior que zero"),
  start_date: z.date({
    required_error: "A data de início é obrigatória",
  }),
  end_date: z.date({
    required_error: "A data de término é obrigatória",
  }),
}).refine((data) => data.end_date > data.start_date, {
  message: "A data de término deve ser posterior à data de início",
  path: ["end_date"],
})

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const result = await query(
      `SELECT 
        id, 
        name, 
        platform, 
        budget, 
        start_date, 
        end_date, 
        status,
        metrics
      FROM ad_campaigns 
      WHERE user_id = ? 
      ORDER BY created_at DESC`,
      [user.id]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[AD_CAMPAIGNS_GET]", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const body = await req.json()
    const validatedData = campaignSchema.parse({
      ...body,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date),
    })

    const result = await query(
      `INSERT INTO ad_campaigns (
        user_id,
        name,
        platform,
        budget,
        start_date,
        end_date,
        status,
        metrics
      ) VALUES (?, ?, ?, ?, ?, ?, 'draft', NULL)
      RETURNING *`,
      [
        user.id,
        validatedData.name,
        validatedData.platform,
        validatedData.budget,
        validatedData.start_date,
        validatedData.end_date,
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error("[AD_CAMPAIGNS_POST]", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
} 