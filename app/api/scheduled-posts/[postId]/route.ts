import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const postId = parseInt(params.postId)

    // Verifica se o post pertence ao usuário
    const checkResult = await query(
      "SELECT id FROM planner_events WHERE id = $1 AND user_id = $2",
      [postId, user.id]
    )

    if (checkResult.rows.length === 0) {
      return new NextResponse("Post não encontrado", { status: 404 })
    }

    // Exclui o post
    await query("DELETE FROM planner_events WHERE id = $1", [postId])

    return new NextResponse("Post excluído com sucesso", { status: 200 })
  } catch (error) {
    console.error("[SCHEDULED_POST_DELETE]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
} 