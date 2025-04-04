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

  const userData = {
    ...user,
    subscription,
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

