import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  // Remover o cookie de sessão
  cookies().delete("session")

  // Redirecionar para a página inicial
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL))
}

