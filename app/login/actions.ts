"use server"

import { cookies } from "next/headers"
import { getUserByEmail, verifyPassword } from "@/lib/auth"
import { createSessionToken } from "@/lib/auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      success: false,
      error: "Email e senha são obrigatórios",
    }
  }

  try {
    // Buscar usuário pelo email
    const user = await getUserByEmail(email)

    if (!user) {
      return {
        success: false,
        error: "Email ou senha incorretos",
      }
    }

    // Verificar senha
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Email ou senha incorretos",
      }
    }

    // Criar token de sessão
    const token = createSessionToken(user.id)

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
    console.error("Erro ao fazer login:", error)
    return {
      success: false,
      error: "Ocorreu um erro ao fazer login. Tente novamente.",
    }
  }
}

