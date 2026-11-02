"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface HeaderProps {
  breadcrumbs?: { title: string; href?: string }[]
}

export function AppHeader({ breadcrumbs = [] }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background sticky top-0 z-10">
      <div className="flex items-center gap-2 px-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">SKP Builder</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((bc, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <div key={bc.title} className="flex items-center gap-2">
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {isLast || !bc.href ? (
                      <BreadcrumbPage>{bc.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={bc.href}>{bc.title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

