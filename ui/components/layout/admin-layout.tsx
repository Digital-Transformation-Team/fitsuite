import type { ReactNode } from "react"

import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { PageContainer } from "./page-container"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  )
}
