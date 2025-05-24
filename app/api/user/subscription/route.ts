import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import * as z from "zod"

const subscriptionSchema = z.object({
  plan_id: z.number().min(1, "Plano inválido"),
})

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = subscriptionSchema.parse(body)

    const sql = neon(process.env.DATABASE_URL!)

    // Verificar se o plano existe
    const planExists = await sql`
      SELECT id FROM plans WHERE id = ${validatedData.plan_id}
    `
    if (planExists.length === 0) {
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar a assinatura
    const now = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // +30 dias

    // Desativar assinatura atual
    await sql`
      UPDATE subscriptions 
      SET status = 'inactive', updated_at = NOW()
      WHERE user_id = ${user.id} AND status = 'active'
    `

    // Criar nova assinatura
    const result = await sql`
      INSERT INTO subscriptions (
        user_id, 
        plan_id, 
        status, 
        current_period_start, 
        current_period_end
      ) VALUES (
        ${user.id}, 
        ${validatedData.plan_id}, 
        'active', 
        ${now}, 
        ${endDate}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 