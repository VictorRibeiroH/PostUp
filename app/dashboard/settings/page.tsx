"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("profile")

  // Carregar dados do usuário (apenas nome por enquanto)
  async function loadUserData() {
    try {
      console.log("Iniciando carregamento dos dados do usuário (apenas nome)...")
      const response = await fetch("/api/user/profile")
      console.log("Resposta da API:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erro na resposta:", errorText)
        throw new Error(`Erro ao carregar dados do usuário: ${errorText}`)
      }
      
      const data = await response.json()
      console.log("Dados recebidos:", data)
      
      setUserData(data)
      
      // Não preencher forms, apenas definir userData

    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados do usuário")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-32">
          <p>Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>

      <div className="flex gap-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "profile" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Perfil
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "notifications" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notificações
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "security" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("security")}
        >
          Segurança
        </button>
      </div>

      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            {userData?.name ? (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="name"
                  value={userData.name}
                  readOnly
                />
              </div>
            ) : (
              <p className="text-muted-foreground">Nome do usuário não disponível.</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funcionalidade de notificações em desenvolvimento.</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funcionalidade de segurança em desenvolvimento.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 