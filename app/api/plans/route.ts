import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("Buscando planos no banco de dados...")
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT * FROM plans 
      ORDER BY price ASC
    `
    console.log("Planos encontrados:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao buscar planos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
} 