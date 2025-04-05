import { NextResponse } from "next/server"

export async function GET() {
  // Criar uma resposta de redirecionamento
  const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL))

  // Definir o cabeçalho Set-Cookie para remover o cookie
  response.headers.set("Set-Cookie", "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly")

  return response
}

