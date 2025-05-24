import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getAuthUser } from "@/lib/auth"

// GET /api/segments
export async function GET() {
  try {
    // Verificar se o usuário está autenticado (opcional, dependendo da necessidade de proteger a lista de segmentos)
    const user = await getAuthUser();
    if (!user) {
       // Se a lista de segmentos for pública, remova esta verificação
       // Se for privada, descomente as linhas abaixo:
       // return NextResponse.json(
       //   { error: "Não autorizado" },
       //   { status: 401 }
       // );
    }

    console.log("Buscando lista de segmentos...")
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`SELECT id, name FROM segments ORDER BY name ASC`

    console.log("Resultado da busca de segmentos:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar segmentos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 