import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
}
