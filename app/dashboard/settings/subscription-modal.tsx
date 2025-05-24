"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Plan {
  id: number
  name: string
  price: string | number
  arts_count: number
  has_ads: boolean
  has_dashboard: boolean
}

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlanId: number
}

export function SubscriptionModal({ isOpen, onClose, currentPlanId }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])

  // Carregar planos ao abrir o modal
  const loadPlans = async () => {
    try {
      console.log("Carregando planos...")
      const response = await fetch("/api/plans")
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erro na resposta da API:", errorText)
        throw new Error("Erro ao carregar planos")
      }
      const data = await response.json()
      console.log("Planos carregados:", data)
      setPlans(data)
    } catch (error) {
      console.error("Erro ao carregar planos:", error)
      toast.error("Erro ao carregar planos")
    }
  }

  // Trocar de plano
  const handlePlanChange = async (planId: number) => {
    if (planId === currentPlanId) {
      toast.info("Você já está neste plano")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/user/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan_id: planId }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast.success("Plano alterado com sucesso!")
      onClose()
      // Recarregar a página para atualizar os dados
      window.location.reload()
    } catch (error) {
      console.error("Erro ao trocar de plano:", error)
      toast.error("Erro ao trocar de plano")
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar planos quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      console.log("Modal aberto, carregando planos...")
      loadPlans()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Assinatura</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={plan.id === currentPlanId ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  R$ {parseFloat(String(plan.price)).toFixed(2)}/mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• {plan.arts_count} artes por mês</li>
                  {plan.has_ads && <li>• Anúncios incluídos</li>}
                  {plan.has_dashboard && <li>• Dashboard de insights</li>}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.id === currentPlanId ? "outline" : "default"}
                  disabled={isLoading || plan.id === currentPlanId}
                  onClick={() => handlePlanChange(plan.id)}
                >
                  {plan.id === currentPlanId ? "Plano Atual" : "Trocar para este plano"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 