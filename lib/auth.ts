import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

// Função para verificar a senha
export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

// Função para hash da senha
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

// Função para criar um token de sessão
export function createSessionToken(userId: number) {
  // Em produção, use um JWT ou outro método seguro
  return Buffer.from(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64")
}

// Função para verificar se o usuário está autenticado
export async function getAuthUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("session")

  if (!token) {
    return null
  }

  try {
    const decoded = JSON.parse(Buffer.from(token.value, "base64").toString())

    if (decoded.exp < Date.now()) {
      return null
    }

    const user = await getUserById(decoded.userId)
    return user
  } catch (error) {
    return null
  }
}

// Middleware para rotas protegidas
export async function requireAuth() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

// Middleware para verificar permissões baseadas na assinatura
export async function checkSubscriptionAccess(requiredFeatures: string[]) {
  const user = await requireAuth()

  // Implementar lógica para verificar se o plano do usuário tem acesso às features requeridas
  // Por exemplo, verificar se o plano permite acesso ao dashboard, anúncios, etc.

  return user
}

// Usuários
export async function getUserByEmail(email: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
    return result[0]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getUserById(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
    return result[0]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

