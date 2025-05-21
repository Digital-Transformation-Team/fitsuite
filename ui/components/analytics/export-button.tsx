"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileText, FileImage, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type ExportFormat = "csv" | "excel" | "pdf" | "image"

interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>
  formats?: ExportFormat[]
  className?: string
}

export function ExportButton({ onExport, formats = ["csv", "excel", "pdf", "image"], className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    setExportFormat(format)
    try {
      await onExport(format)
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error)
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting {exportFormat?.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.includes("csv") && (
          <DropdownMenuItem onClick={() => handleExport("csv")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Export as CSV</span>
          </DropdownMenuItem>
        )}
        {formats.includes("excel") && (
          <DropdownMenuItem onClick={() => handleExport("excel")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export as Excel</span>
          </DropdownMenuItem>
        )}
        {formats.includes("pdf") && (
          <DropdownMenuItem onClick={() => handleExport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Export as PDF</span>
          </DropdownMenuItem>
        )}
        {formats.includes("image") && (
          <DropdownMenuItem onClick={() => handleExport("image")}>
            <FileImage className="mr-2 h-4 w-4" />
            <span>Export as Image</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
