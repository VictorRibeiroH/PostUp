"use server"

import { cookies } from "next/headers"
import { getUserByEmail, hashPassword } from "@/lib/auth"
import { createSessionToken } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

interface RegisterData {
  name: string
  email: string
  password: string
  segment: string
  plan: string
}

export async function register(data: RegisterData) {
  console.log("Iniciando registro com dados:", { ...data, password: "***" })

  const { name, email, password, segment, plan } = data

  if (!name || !email || !password || !segment || !plan) {
    console.log("Campos obrigatórios faltando")
    return {
      success: false,
      error: "Todos os campos são obrigatórios",
    }
  }

  try {
    // Verificar se o email já está em uso
    console.log("Verificando se email já existe:", email)
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      console.log("Email já em uso")
      return {
        success: false,
        error: "Este email já está em uso",
      }
    }

    // Hash da senha
    console.log("Gerando hash da senha")
    const passwordHash = await hashPassword(password)

    // Inicializar o cliente SQL diretamente
    const sql = neon(process.env.DATABASE_URL!)

    // Inserir usuário no banco de dados
    console.log("Inserindo usuário no banco de dados")
    try {
      const result = await sql`
        INSERT INTO users (name, email, password_hash, segment_id) 
        VALUES (${name}, ${email}, ${passwordHash}, ${segment}) 
        RETURNING id
      `

      console.log("Resultado da inserção:", result)

      if (!result || result.length === 0) {
        return {
          success: false,
          error: "Falha ao criar usuário",
        }
      }

      const userId = result[0].id

      // Criar assinatura
      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // Assinatura de 1 mês

      console.log("Criando assinatura para usuário:", userId)
      await sql`
        INSERT INTO subscriptions (user_id, plan_id, status, current_period_start, current_period_end) 
        VALUES (${userId}, ${plan}, 'active', ${now}, ${endDate})
      `

      // Criar token de sessão
      console.log("Criando token de sessão")
      const token = createSessionToken(userId)

      // Salvar token nos cookies
      console.log("Salvando token nos cookies")
      cookies().set({
        name: "session",
        value: token,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
      })

      console.log("Registro concluído com sucesso")
      return {
        success: true,
      }
    } catch (dbError) {
      console.error("Erro específico na operação do banco de dados:", dbError)
      return {
        success: false,
        error: "Erro ao inserir dados no banco de dados: " + (dbError as Error).message,
      }
    }
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return {
      success: false,
      error: "Ocorreu um erro ao criar sua conta. Tente novamente.",
    }
  }
}

