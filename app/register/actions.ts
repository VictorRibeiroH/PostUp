"use server"

import { cookies } from "next/headers"
import { getUserByEmail, hashPassword } from "@/lib/auth"
import { createSessionToken } from "@/lib/auth"
import { query } from "@/lib/db"

interface RegisterData {
  name: string
  email: string
  password: string
  segment: string
  plan: string
}

export async function register(data: RegisterData) {
  const { name, email, password, segment, plan } = data

  if (!name || !email || !password || !segment || !plan) {
    return {
      success: false,
      error: "Todos os campos são obrigatórios",
    }
  }

  try {
    // Verificar se o email já está em uso
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return {
        success: false,
        error: "Este email já está em uso",
      }
    }

    // Hash da senha
    const passwordHash = await hashPassword(password)

    // Inserir usuário no banco de dados
    const result = await query(
      "INSERT INTO users (name, email, password_hash, segment_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, passwordHash, segment],
    )

    const userId = result.rows[0].id

    // Criar assinatura
    const now = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // Assinatura de 1 mês

    await query(
      "INSERT INTO subscriptions (user_id, plan_id, status, current_period_start, current_period_end) VALUES ($1, $2, $3, $4, $5)",
      [userId, plan, "active", now, endDate],
    )

    // Criar token de sessão
    const token = createSessionToken(userId)

    // Salvar token nos cookies
    cookies().set({
      name: "session",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return {
      success: false,
      error: "Ocorreu um erro ao criar sua conta. Tente novamente.",
    }
  }
}

