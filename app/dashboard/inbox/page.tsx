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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Message {
  id: number
  subject: string
  content: string
  is_read: boolean
  is_archived: boolean
  created_at: string
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadMessages() {
    try {
      const response = await fetch("/api/messages")
      if (!response.ok) throw new Error("Erro ao carregar mensagens")
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      toast.error("Erro ao carregar mensagens")
    } finally {
      setIsLoading(false)
    }
  }

  async function markAsRead(messageId: number) {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "PATCH",
      })
      if (!response.ok) throw new Error("Erro ao marcar mensagem como lida")
      await loadMessages()
      toast.success("Mensagem marcada como lida")
    } catch (error) {
      toast.error("Erro ao marcar mensagem como lida")
    }
  }

  async function archiveMessage(messageId: number) {
    try {
      const response = await fetch(`/api/messages/${messageId}/archive`, {
        method: "PATCH",
      })
      if (!response.ok) throw new Error("Erro ao arquivar mensagem")
      await loadMessages()
      toast.success("Mensagem arquivada")
    } catch (error) {
      toast.error("Erro ao arquivar mensagem")
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Caixa de Entrada</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mensagens</CardTitle>
          <CardDescription>
            Gerencie suas mensagens e notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p>Carregando mensagens...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p>Nenhuma mensagem encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">
                      {message.subject}
                    </TableCell>
                    <TableCell>
                      {format(new Date(message.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {message.is_archived ? (
                        <Badge variant="secondary">Arquivada</Badge>
                      ) : message.is_read ? (
                        <Badge variant="outline">Lida</Badge>
                      ) : (
                        <Badge>Nova</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {!message.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(message.id)}
                        >
                          Marcar como lida
                        </Button>
                      )}
                      {!message.is_archived && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => archiveMessage(message.id)}
                        >
                          Arquivar
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