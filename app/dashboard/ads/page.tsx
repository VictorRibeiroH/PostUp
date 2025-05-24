"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface AdCampaign {
  id: number
  name: string
  platform: string
  budget: number
  start_date: string
  end_date: string
  status: string
  metrics: {
    impressions?: number
    clicks?: number
    ctr?: number
    spend?: number
  } | null
}

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  platform: z.string().min(1, "A plataforma é obrigatória"),
  budget: z.number().min(1, "O orçamento deve ser maior que zero"),
  start_date: z.date({
    required_error: "A data de início é obrigatória",
  }),
  end_date: z.date({
    required_error: "A data de término é obrigatória",
  }),
}).refine((data) => data.end_date > data.start_date, {
  message: "A data de término deve ser posterior à data de início",
  path: ["end_date"],
})

export default function AdsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      platform: "",
      budget: 0,
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  })

  async function loadCampaigns() {
    try {
      const response = await fetch("/api/ad-campaigns")
      if (!response.ok) throw new Error("Erro ao carregar campanhas")
      const data = await response.json()
      setCampaigns(data)
    } catch (error) {
      toast.error("Erro ao carregar campanhas")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/ad-campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Erro ao criar campanha")
      
      await loadCampaigns()
      setIsDialogOpen(false)
      form.reset()
      toast.success("Campanha criada com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar campanha")
    }
  }

  async function updateCampaignStatus(campaignId: number, newStatus: string) {
    try {
      const response = await fetch(`/api/ad-campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Erro ao atualizar status da campanha")
      
      await loadCampaigns()
      toast.success("Status da campanha atualizado!")
    } catch (error) {
      toast.error("Erro ao atualizar status da campanha")
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Anúncios</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nova Campanha</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da sua campanha publicitária
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Campanha</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plataforma</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a plataforma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="google">Google Ads</SelectItem>
                          <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Início</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={format(field.value, "yyyy-MM-dd")}
                          onChange={(e) => {
                            const date = new Date(e.target.value)
                            field.onChange(date)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data de Término</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={format(field.value, "yyyy-MM-dd")}
                          onChange={(e) => {
                            const date = new Date(e.target.value)
                            field.onChange(date)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Criar Campanha</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campanhas Ativas</CardTitle>
          <CardDescription>
            Gerencie suas campanhas publicitárias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p>Carregando campanhas...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p>Nenhuma campanha encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Orçamento</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Métricas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign.name}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{campaign.platform}</span>
                    </TableCell>
                    <TableCell>
                      R$ {campaign.budget.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(campaign.start_date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}{" "}
                      -{" "}
                      {format(new Date(campaign.end_date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          campaign.status === "active"
                            ? "default"
                            : campaign.status === "paused"
                            ? "secondary"
                            : campaign.status === "completed"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {campaign.status === "active"
                          ? "Ativa"
                          : campaign.status === "paused"
                          ? "Pausada"
                          : campaign.status === "completed"
                          ? "Concluída"
                          : "Rascunho"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.metrics ? (
                        <div className="text-sm">
                          <p>Impressões: {campaign.metrics.impressions?.toLocaleString()}</p>
                          <p>Cliques: {campaign.metrics.clicks?.toLocaleString()}</p>
                          <p>CTR: {campaign.metrics.ctr?.toFixed(2)}%</p>
                          <p>Gasto: R$ {campaign.metrics.spend?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sem métricas</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {campaign.status === "draft" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCampaignStatus(campaign.id, "active")}
                        >
                          Ativar
                        </Button>
                      )}
                      {campaign.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCampaignStatus(campaign.id, "paused")}
                        >
                          Pausar
                        </Button>
                      )}
                      {campaign.status === "paused" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCampaignStatus(campaign.id, "active")}
                        >
                          Retomar
                        </Button>
                      )}
                      {campaign.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCampaignStatus(campaign.id, "completed")}
                        >
                          Concluir
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 