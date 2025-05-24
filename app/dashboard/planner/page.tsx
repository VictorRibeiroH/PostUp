"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface PlannerEvent {
  id: number
  title: string
  content: string
  platform: string
  start_date: string
  status: string
}

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  platform: z.string().min(1, "A plataforma é obrigatória"),
  start_date: z.date({
    required_error: "A data é obrigatória",
  }),
})

export default function PlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      platform: "",
      start_date: new Date(),
    },
  })

  async function loadEvents() {
    try {
      const response = await fetch("/api/scheduled-posts")
      if (!response.ok) throw new Error("Erro ao carregar eventos")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast.error("Erro ao carregar eventos")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/scheduled-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Erro ao agendar post")
      
      await loadEvents()
      setIsDialogOpen(false)
      form.reset()
      toast.success("Post agendado com sucesso!")
    } catch (error) {
      toast.error("Erro ao agendar post")
    }
  }

  async function deleteEvent(eventId: number) {
    try {
      const response = await fetch(`/api/scheduled-posts/${eventId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao excluir post")
      
      await loadEvents()
      toast.success("Post excluído com sucesso!")
    } catch (error) {
      toast.error("Erro ao excluir post")
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const eventsForSelectedDate = events.filter(
    (event) =>
      selectedDate &&
      format(new Date(event.start_date), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Planner</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Agendar Post</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Novo Post</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do post que você deseja agendar
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
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
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data e Hora</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
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
                  <Button type="submit">Agendar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>
              Selecione uma data para ver os posts agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Posts para{" "}
              {selectedDate &&
                format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
            </CardTitle>
            <CardDescription>
              {eventsForSelectedDate.length === 0
                ? "Nenhum post agendado para esta data"
                : `${eventsForSelectedDate.length} posts agendados`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p>Carregando posts...</p>
              </div>
            ) : eventsForSelectedDate.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p>Nenhum post agendado para esta data</p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.start_date), "HH:mm", {
                              locale: ptBR,
                            })}
                          </p>
                          <p className="mt-2 text-sm">{event.content}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {event.platform}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                event.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : event.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {event.status === "pending"
                                ? "Pendente"
                                : event.status === "published"
                                ? "Publicado"
                                : "Falhou"}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 