import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { getUserShortcuts, getUserContents, getUserNotifications, getUserSubscription } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CalendarDays, Image, Inbox, Plus, Settings } from "lucide-react"

export default async function DashboardPage() {
  const user = await requireAuth()

  if (!user) {
    redirect("/login")
  }

  // Buscar dados do usuário
  const shortcuts = await getUserShortcuts(user.id)
  const contents = await getUserContents(user.id)
  const notifications = await getUserNotifications(user.id)
  const subscription = await getUserSubscription(user.id)

  // Definir atalhos padrão se não houver atalhos personalizados
  const defaultShortcuts = [
    { name: "Conteúdos", url: "/dashboard/contents", icon: "Image" },
    { name: "Planner", url: "/dashboard/planner", icon: "CalendarDays" },
    { name: "Caixa de Entrada", url: "/dashboard/inbox", icon: "Inbox" },
    { name: "Configurações", url: "/dashboard/settings", icon: "Settings" },
  ]

  const userShortcuts = shortcuts.length > 0 ? shortcuts : defaultShortcuts

  // Verificar o plano do usuário
  const planName = subscription?.name || "Plano não encontrado"
  const artsCount = subscription?.arts_count || 0
  const hasAds = subscription?.has_ads || false
  const hasDashboard = subscription?.has_dashboard || false

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Olá, {user.name}</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle. Aqui você pode gerenciar seu conteúdo e marketing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Seu Plano</CardTitle>
            <CardDescription>Detalhes da sua assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planName}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {artsCount} artes por mês
              {hasAds && " • Anúncios incluídos"}
              {hasDashboard && " • Dashboard de insights"}
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/settings/subscription">Gerenciar Assinatura</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conteúdos</CardTitle>
            <CardDescription>Artes e publicações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contents?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {artsCount - (contents?.length || 0)} artes disponíveis este mês
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/contents">Ver Conteúdos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <CardDescription>Mensagens e alertas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {notifications?.filter((n: any) => !n.is_read)?.length || 0} não lidas
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <Link href="/dashboard/inbox">Ver Caixa de Entrada</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
            <CardDescription>Atalhos personalizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/contents/new">
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Arte
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/planner/new">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Evento
                </Link>
              </Button>
              {hasAds && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/ads/new">
                    <Plus className="h-4 w-4 mr-1" />
                    Novo Anúncio
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings/shortcuts">
                  <Settings className="h-4 w-4 mr-1" />
                  Personalizar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-4">Atalhos</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userShortcuts.map((shortcut: any, index: number) => {
          const IconComponent =
            shortcut.icon === "Image"
              ? Image
              : shortcut.icon === "CalendarDays"
                ? CalendarDays
                : shortcut.icon === "Inbox"
                  ? Inbox
                  : Settings

          return (
            <Link href={shortcut.url} key={index}>
              <Card className="h-full hover:bg-muted/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <IconComponent className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium">{shortcut.name}</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <h2 className="text-xl font-semibold mt-4">Conteúdos Recentes</h2>
      {contents && contents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contents.slice(0, 3).map((content: any) => (
            <Card key={content.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{content.title}</CardTitle>
                <CardDescription>{new Date(content.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md mb-2 overflow-hidden">
                  {content.image_url ? (
                    <img
                      src={content.image_url || "/placeholder.svg"}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{content.description || "Sem descrição"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum conteúdo encontrado</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Você ainda não criou nenhum conteúdo. Comece agora mesmo!
            </p>
            <Button asChild>
              <Link href="/dashboard/contents/new">
                <Plus className="h-4 w-4 mr-2" />
                Criar Conteúdo
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

