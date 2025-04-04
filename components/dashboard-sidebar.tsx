"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  Home,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  disabled?: boolean
  requiresPremium?: boolean
}

interface SidebarProps {
  user: {
    name: string
    email: string
    subscription: {
      plan_id: number
    }
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isPremium = user?.subscription?.plan_id === 5

  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Caixa de Entrada",
      href: "/dashboard/inbox",
      icon: Inbox,
    },
    {
      title: "Conteúdos",
      href: "/dashboard/contents",
      icon: Image,
    },
    {
      title: "Planner",
      href: "/dashboard/planner",
      icon: Calendar,
    },
    {
      title: "Anúncios",
      href: "/dashboard/ads",
      icon: MessageSquare,
      disabled: ![4, 5].includes(user?.subscription?.plan_id),
    },
    {
      title: "Insights",
      href: "/dashboard/insights",
      icon: BarChart3,
      requiresPremium: true,
    },
    {
      title: "Configurações",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex h-full flex-col">
            <div className="px-4 py-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 font-bold text-lg text-primary"
                onClick={() => setOpen(false)}
              >
                <LayoutDashboard className="h-6 w-6" />
                <span>PostUp</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {navItems.map((item, index) => {
                  if (item.requiresPremium && !isPremium) {
                    return null
                  }

                  return (
                    <Link
                      key={index}
                      href={item.disabled ? "#" : item.href}
                      onClick={() => {
                        if (!item.disabled) setOpen(false)
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                        pathname === item.href ? "bg-muted font-medium text-primary" : "text-muted-foreground",
                        item.disabled && "pointer-events-none opacity-60",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.disabled && (
                        <span className="ml-auto text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">Upgrade</span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <div className="flex items-center gap-2 rounded-lg border p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/api/auth/logout">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sair</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
        <div className="flex h-full flex-col">
          <div className="px-4 py-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
              <LayoutDashboard className="h-6 w-6" />
              <span>PostUp</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {navItems.map((item, index) => {
                if (item.requiresPremium && !isPremium) {
                  return null
                }

                return (
                  <Link
                    key={index}
                    href={item.disabled ? "#" : item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                      pathname === item.href ? "bg-muted font-medium text-primary" : "text-muted-foreground",
                      item.disabled && "pointer-events-none opacity-60",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.disabled && (
                      <span className="ml-auto text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">Upgrade</span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <div className="flex items-center gap-2 rounded-lg border p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/api/auth/logout">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Sair</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

