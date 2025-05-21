"use client"

import { Check, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface Language {
  code: string
  name: string
  flag?: string
}

interface LanguageSwitcherProps {
  languages: Language[]
  currentLanguage: string
  onLanguageChange: (languageCode: string) => void
}

export function LanguageSwitcher({ languages, currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const current = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          <span>{current.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className="flex items-center justify-between"
          >
            <span>
              {language.flag && <span className="mr-2">{language.flag}</span>}
              {language.name}
            </span>
            {language.code === currentLanguage && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
