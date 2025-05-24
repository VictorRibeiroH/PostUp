import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"
import * as z from "zod"

const updateStatusSchema = z.object({
  status: z.enum(["draft", "active", "paused", "completed"]),
})

export async function PATCH(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const body = await req.json()
    const validatedData = updateStatusSchema.parse(body)

    // Verifica se a campanha pertence ao usuário
    const campaign = await query(
      "SELECT id FROM ad_campaigns WHERE id = ? AND user_id = ?",
      [params.campaignId, user.id]
    )

    if (!campaign.rows.length) {
      return new NextResponse("Campanha não encontrada", { status: 404 })
    }

    // Atualiza o status da campanha
    const result = await query(
      `UPDATE ad_campaigns 
       SET status = ? 
       WHERE id = ? AND user_id = ?
       RETURNING *`,
      [validatedData.status, params.campaignId, user.id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error("[AD_CAMPAIGNS_PATCH]", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
} 