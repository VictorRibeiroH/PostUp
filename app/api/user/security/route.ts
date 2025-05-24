import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"
import * as z from "zod"
import bcrypt from "bcryptjs"

const securitySchema = z.object({
  currentPassword: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const body = await req.json()
    const validatedData = securitySchema.parse(body)

    // Busca o usuário com a senha atual
    const result = await query(
      "SELECT password FROM users WHERE id = ?",
      [user.id]
    )

    if (result.rows.length === 0) {
      return new NextResponse("Usuário não encontrado", { status: 404 })
    }

    const currentUser = result.rows[0]

    // Verifica se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      currentUser.password
    )

    if (!isPasswordValid) {
      return new NextResponse("Senha atual incorreta", { status: 400 })
    }

    // Gera o hash da nova senha
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)

    // Atualiza a senha
    await query(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, user.id]
    )

    return new NextResponse("Senha atualizada com sucesso", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error("[USER_SECURITY_PATCH]", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
} 