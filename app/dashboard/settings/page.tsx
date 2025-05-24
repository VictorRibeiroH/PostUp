"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubscriptionModal } from "./subscription-modal"

const profileSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional(),
  segment_id: z.coerce.number().optional(),
  phone: z.string().optional(),
})

const securitySchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória"),
  newPassword: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(1, "A confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [segments, setSegments] = useState<{ id: number; name: string }[]>([]);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      segment_id: undefined,
      phone: "",
    },
  })

  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function loadData() {
    try {
      console.log("Iniciando carregamento dos dados e segmentos...")

      const segmentsResponse = await fetch("/api/segments")
      if (!segmentsResponse.ok) {
         const errorText = await segmentsResponse.text();
         console.error("Erro ao carregar segmentos:", errorText);
      } else {
         const segmentsData = await segmentsResponse.json();
         console.log("Segmentos carregados:", segmentsData);
         setSegments(segmentsData);
      }

      const userResponse = await fetch("/api/user/profile")
      console.log("Resposta da API do perfil:", userResponse.status)

      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.error("Erro na resposta do perfil:", errorText)
        throw new Error(`Erro ao carregar dados do usuário: ${errorText}`)
      }

      const data = await userResponse.json()
      console.log("Dados do usuário recebidos:", data)

      setUserData(data)

      profileForm.reset({
        name: data.user_name || "",
        email: data.email || "",
        segment_id: data.segment_id ?? undefined,
      })

    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const getSegmentName = (segmentId: number | undefined): string => {
    if (segmentId === undefined || segmentId === null) return "Não especificado";
    const segment = segments.find(s => s.id === segmentId);
    return segment ? segment.name : "Segmento não encontrado";
  };

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    console.log("--- Tentativa de salvar perfil detectada ---");
    try {
      console.log("Enviando dados para atualização de perfil:", values)
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           name: values.name,
           segment_id: values.segment_id,
        }),
      })

      if (!response.ok) {
         const errorText = await response.text();
         console.error("Erro na atualização de perfil:", errorText);
         throw new Error(`Erro ao atualizar perfil: ${errorText}`);
      }

      const updatedData = await response.json()
      console.log("Perfil atualizado:", updatedData);
      setUserData(updatedData);
      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil.")
    }
  }

  async function onSecuritySubmit(values: z.infer<typeof securitySchema>) {
    try {
      console.log("Enviando dados para atualização de senha:", values)
      const response = await fetch("/api/user/security", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })

      if (!response.ok) {
         const errorText = await response.text();
         console.error("Erro na atualização de senha:", errorText);
         throw new Error(`Erro ao atualizar senha: ${errorText}`);
      }

      console.log("Senha atualizada com sucesso!");
      securityForm.reset();
      toast.success("Senha atualizada com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      toast.error("Erro ao atualizar senha. Verifique a senha atual.")
    }
  }

  useEffect(() => {
    loadData();
  }, []);

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
    <>
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
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome
                  </label>
                  <Input
                    id="name"
                    {...profileForm.register("name")}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={userData?.email || ''}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="segment_id" className="text-sm font-medium">
                    Segmento
                  </label>
                  <Select
                    value={profileForm.watch("segment_id")?.toString() || ""}
                    onValueChange={(value) => profileForm.setValue("segment_id", value === "" ? undefined : parseInt(value))}
                    disabled={segments.length === 0 || profileForm.formState.isSubmitting}
                  >
                    <SelectTrigger id="segment_id">
                      <SelectValue placeholder="Selecione seu segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id.toString()}>
                          {segment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {profileForm.formState.errors.segment_id && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.segment_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Plano</label>
                  <p className="text-base text-muted-foreground">{userData?.plan_name || 'Plano não encontrado'}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      console.log("Abrindo modal de assinatura. Plan ID atual:", userData?.plan_id)
                      setIsSubscriptionModalOpen(true)
                    }}
                  >
                    Gerenciar Assinatura
                  </Button>
                </div>

                <Button type="submit" disabled={profileForm.formState.isSubmitting}>Salvar Alterações</Button>
              </form>
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
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">
                    Senha Atual
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...securityForm.register("currentPassword")}
                  />
                  {securityForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    Nova Senha
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...securityForm.register("newPassword")}
                  />
                  {securityForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Nova Senha
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...securityForm.register("confirmPassword")}
                  />
                  {securityForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={securityForm.formState.isSubmitting}>Atualizar Senha</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlanId={userData?.plan_id || 0}
      />
    </>
  )
} 