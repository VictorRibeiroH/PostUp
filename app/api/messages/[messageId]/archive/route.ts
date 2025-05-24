import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const messageId = parseInt(params.messageId)

    // Verifica se a mensagem pertence ao usuário
    const checkResult = await query(
      "SELECT id FROM messages WHERE id = $1 AND user_id = $2",
      [messageId, user.id]
    )

    if (checkResult.rows.length === 0) {
      return new NextResponse("Mensagem não encontrada", { status: 404 })
    }

    // Atualiza o status da mensagem
    await query(
      "UPDATE messages SET is_archived = true WHERE id = $1",
      [messageId]
    )

    return new NextResponse("Mensagem arquivada", { status: 200 })
  } catch (error) {
    console.error("[MESSAGE_ARCHIVE]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
} 