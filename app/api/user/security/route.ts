import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"
import * as z from "zod"
import bcrypt from "bcryptjs"

// Schema para validação da atualização de senha (removendo confirmPassword)
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  // Removido confirmPassword daqui, a validação de igualdade é feita no frontend
})

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      // Se getAuthUser retornar null ou undefined, significa que o usuário não está autenticado ou não foi encontrado
      return NextResponse.json(
        { error: "Não autorizado ou usuário não encontrado" },
        { status: 401 }
      )
    }

    console.log("Usuário autenticado na API de segurança:", user.id, user.email)

    const body = await request.json()
    console.log("Dados recebidos para atualização de senha na API:", body)

    // Validar dados
    const validatedData = updatePasswordSchema.parse(body)
    console.log("Dados validados na API:", validatedData)

    // Usar o password_hash do objeto user retornado por getAuthUser
    let currentPasswordHash = user.password_hash; // Alterado para let

    if (!currentPasswordHash) {
      // Isso pode acontecer se a função getAuthUser não retorna o password_hash
      // Se sua função getAuthUser não retorna password_hash, precisaremos buscá-lo separadamente
      console.error("password_hash não disponível no objeto user retornado por getAuthUser")
       const userRecord = await query(
          `SELECT password_hash FROM users WHERE id = $1`,
          [user.id]
       );
       if (userRecord.rows.length === 0) {
          return NextResponse.json(
              { error: "Usuário não encontrado no banco de dados (fallback)" },
              { status: 404 }
          );
       }
       currentPasswordHash = userRecord.rows[0].password_hash;
    }

    // Verificar se a senha atual fornecida coincide com o hash no banco de dados
    const isPasswordCorrect = await bcrypt.compare(validatedData.currentPassword, currentPasswordHash);

    if (!isPasswordCorrect) {
        return NextResponse.json(
            { error: "Senha atual incorreta" },
            { status: 400 } // Bad Request ou Unauthorized, 400 é comum para falha de validação de dados
        );
    }

    // Gerar hash para a nova senha
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 10); // 10 é o salt rounds

    // Atualizar senha no banco de dados
    // Nota: Estou usando a função query aqui, ajuste se sua API usa neon diretamente
    await query(
        `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
        [newPasswordHash, user.id]
    );


    console.log("Senha atualizada no banco de dados para o usuário:", user.id);

    // Retornar sucesso (geralmente sem dados sensíveis)
    return NextResponse.json({ message: "Senha atualizada com sucesso!" }, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar senha na API:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados de entrada inválidos", details: error.errors },
        { status: 400 }
      )
    }

    // Tratar outros erros de banco de dados, etc.
    return NextResponse.json(
      { error: "Erro interno do servidor ao atualizar senha" },
      { status: 500 }
    )
  }
} 