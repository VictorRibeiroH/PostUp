import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import * as z from "zod"

const profileSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  segment_id: z.coerce.number().optional(),
})

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    console.log("Buscando perfil do usuário:", user.id)
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT 
        id, 
        name, 
        email, 
        segment_id
      FROM users 
      WHERE id = ${user.id}
    `

    console.log("Resultado da busca:", result)

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("Dados recebidos para atualização:", body)

    const dataToValidate = { 
      ...body,
      segment_id: body.segment ? parseInt(body.segment) : undefined
    }
    const validatedData = profileSchema.parse(dataToValidate)
    console.log("Dados validados:", validatedData)

    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      UPDATE users 
      SET 
        name = ${validatedData.name},
        email = ${validatedData.email},
        segment_id = ${validatedData.segment_id},
        updated_at = NOW()
      WHERE id = ${user.id}
      RETURNING id, name, email, segment_id
    `

    console.log("Resultado da atualização:", result)

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    
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