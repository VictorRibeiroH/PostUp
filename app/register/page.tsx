"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { register } from "./actions"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    segment: "",
    plan: searchParams.get("plan") || "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (step === 1) {
      setStep(2)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await register(formData)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            {step === 1 ? "Preencha seus dados para criar uma conta" : "Selecione seu segmento e plano"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="segment">Segmento</Label>
                  <Select
                    value={formData.segment}
                    onValueChange={(value) => handleSelectChange("segment", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Alimentação</SelectItem>
                      <SelectItem value="2">Saúde</SelectItem>
                      <SelectItem value="3">Esporte</SelectItem>
                      <SelectItem value="4">Estética</SelectItem>
                      <SelectItem value="5">Beleza e Bem Estar</SelectItem>
                      <SelectItem value="6">Advocacia</SelectItem>
                      <SelectItem value="7">Arquitetura</SelectItem>
                      <SelectItem value="8">Imóveis</SelectItem>
                      <SelectItem value="9">Pet</SelectItem>
                      <SelectItem value="10">Moda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Plano</Label>
                  <Select value={formData.plan} onValueChange={(value) => handleSelectChange("plan", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Start - R$ 100/mês</SelectItem>
                      <SelectItem value="2">Plus - R$ 180/mês</SelectItem>
                      <SelectItem value="3">Premium Content - R$ 249/mês</SelectItem>
                      <SelectItem value="4">Básico Complete - R$ 250/mês</SelectItem>
                      <SelectItem value="5">Premium Complete - R$ 500/mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {step === 1 ? "Continuar" : isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

