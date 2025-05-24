import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { query } from "@/lib/db"
import * as z from "zod"

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  newMessages: z.boolean(),
  scheduledPosts: z.boolean(),
  campaignUpdates: z.boolean(),
})

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 })
    }

    const body = await req.json()
    const validatedData = notificationSchema.parse(body)

    // Verifica se já existem preferências de notificação
    const checkResult = await query(
      "SELECT id FROM user_notifications WHERE user_id = ?",
      [user.id]
    )

    if (checkResult.rows.length === 0) {
      // Insere novas preferências
      const result = await query(
        `INSERT INTO user_notifications (
          user_id,
          email_notifications,
          push_notifications,
          marketing_emails,
          new_messages,
          scheduled_posts,
          campaign_updates
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING *`,
        [
          user.id,
          validatedData.emailNotifications,
          validatedData.pushNotifications,
          validatedData.marketingEmails,
          validatedData.newMessages,
          validatedData.scheduledPosts,
          validatedData.campaignUpdates,
        ]
      )
      return NextResponse.json(result.rows[0])
    } else {
      // Atualiza preferências existentes
      const result = await query(
        `UPDATE user_notifications 
         SET email_notifications = ?,
             push_notifications = ?,
             marketing_emails = ?,
             new_messages = ?,
             scheduled_posts = ?,
             campaign_updates = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?
         RETURNING *`,
        [
          validatedData.emailNotifications,
          validatedData.pushNotifications,
          validatedData.marketingEmails,
          validatedData.newMessages,
          validatedData.scheduledPosts,
          validatedData.campaignUpdates,
          user.id,
        ]
      )
      return NextResponse.json(result.rows[0])
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error("[USER_NOTIFICATIONS_PATCH]", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
} 