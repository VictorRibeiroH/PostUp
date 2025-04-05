import type React from "react"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { requireAuth } from "@/lib/auth"
import { getUserSubscription } from "@/lib/db"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  if (!user) {
    redirect("/login")
  }

  // Buscar assinatura do usuário
  const subscription = await getUserSubscription(user.id)

  // Garantir que userData tenha todas as propriedades necessárias
  const userData = {
    name: user.name,
    email: user.email,
    subscription: subscription || { plan_id: 1 }, // Fornecer um valor padrão se subscription for null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar user={userData} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

