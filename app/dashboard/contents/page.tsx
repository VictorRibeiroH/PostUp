import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { getUserContents, getUserSubscription } from "@/lib/db"
import { Image, Plus } from "lucide-react"

export default async function ContentsPage() {
  const user = await requireAuth()

  if (!user) {
    redirect("/login")
  }

  // Buscar conteúdos do usuário
  const contents = await getUserContents(user.id)

  // Buscar assinatura do usuário para verificar limite de artes
  const subscription = await getUserSubscription(user.id)
  const artsLimit = subscription?.arts_count || 0
  const artsUsed = contents?.length || 0
  const artsAvailable = artsLimit - artsUsed

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Conteúdos</h1>
          <Button asChild disabled={artsAvailable <= 0}>
            <Link href="/dashboard/contents/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Conteúdo
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">
          Gerencie suas artes e publicações. Você tem {artsAvailable} artes disponíveis este mês.
        </p>
      </div>

      {contents && contents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contents.map((content: any) => (
            <Card key={content.id} className="overflow-hidden">
              <div className="aspect-video bg-muted overflow-hidden">
                {content.image_url ? (
                  <img
                    src={content.image_url || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{content.title}</CardTitle>
                <CardDescription>
                  {content.status === "draft" && "Rascunho"}
                  {content.status === "scheduled" &&
                    `Agendado para ${new Date(content.scheduled_date).toLocaleDateString()}`}
                  {content.status === "published" &&
                    `Publicado em ${new Date(content.created_at).toLocaleDateString()}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {content.description || "Sem descrição"}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/contents/${content.id}`}>Ver Detalhes</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/contents/${content.id}/edit`}>Editar</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Image className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-2">Nenhum conteúdo encontrado</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              Você ainda não criou nenhum conteúdo. Comece agora mesmo criando sua primeira arte personalizada!
            </p>
            <Button asChild disabled={artsAvailable <= 0}>
              <Link href="/dashboard/contents/new">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Conteúdo
              </Link>
            </Button>
            {artsAvailable <= 0 && (
              <p className="text-sm text-destructive mt-4">
                Você atingiu o limite de artes do seu plano. Faça upgrade para criar mais conteúdos.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

