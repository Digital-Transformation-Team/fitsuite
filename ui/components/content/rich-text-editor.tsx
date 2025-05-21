"use client"

import { useState } from "react"
import { Bold, Italic, Link, List, ListOrdered, ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  initialValue?: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
}

export function RichTextEditor({
  initialValue = "",
  onChange,
  placeholder = "Write your content here...",
  minHeight = "200px",
  className,
}: RichTextEditorProps) {
  const [value, setValue] = useState(initialValue)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChange(newValue)
  }

  const handleToolbarAction = (action: string) => {
    // In a real implementation, these would modify the text with proper formatting
    // For this demo, we'll just append placeholder text
    let newText = value
    const selectionStart = (document.getElementById("editor") as HTMLTextAreaElement)?.selectionStart || 0
    const selectionEnd = (document.getElementById("editor") as HTMLTextAreaElement)?.selectionEnd || 0
    const selectedText = value.substring(selectionStart, selectionEnd)

    switch (action) {
      case "bold":
        newText =
          value.substring(0, selectionStart) + `**${selectedText || "bold text"}**` + value.substring(selectionEnd)
        break
      case "italic":
        newText =
          value.substring(0, selectionStart) + `*${selectedText || "italic text"}*` + value.substring(selectionEnd)
        break
      case "link":
        newText =
          value.substring(0, selectionStart) +
          `[${selectedText || "link text"}](https://example.com)` +
          value.substring(selectionEnd)
        break
      case "list":
        newText =
          value.substring(0, selectionStart) +
          `\n- List item 1\n- List item 2\n- List item 3\n` +
          value.substring(selectionEnd)
        break
      case "ordered-list":
        newText =
          value.substring(0, selectionStart) +
          `\n1. List item 1\n2. List item 2\n3. List item 3\n` +
          value.substring(selectionEnd)
        break
      case "image":
        newText =
          value.substring(0, selectionStart) +
          `![Image description](https://example.com/image.jpg)` +
          value.substring(selectionEnd)
        break
      default:
        break
    }

    handleChange(newText)
  }

  // Simple markdown to HTML conversion for preview
  // In a real implementation, you would use a proper markdown parser
  const renderPreview = () => {
    const html = value
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" style="max-width: 100%;" />')
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>")
      .replace(/<\/ul><ul>/g, "")
      .replace(/^(\d+)\. (.*?)$/gm, "<li>$2</li>")
      .replace(/\n/g, "<br />")

    return html
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("link")}
          title="Link"
        >
          <Link className="h-4 w-4" />
          <span className="sr-only">Link</span>
        </Button>
        <div className="h-8 w-px bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("list")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("ordered-list")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <div className="h-8 w-px bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("image")}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Insert Image</span>
        </Button>
        <div className="h-8 w-px bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("align-left")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
          <span className="sr-only">Align Left</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("align-center")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
          <span className="sr-only">Align Center</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleToolbarAction("align-right")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
          <span className="sr-only">Align Right</span>
        </Button>
      </div>

      <Tabs
        defaultValue="write"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "write" | "preview")}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="text-xs text-muted-foreground">{value.length} characters</div>
        </div>

        <TabsContent value="write" className="p-0 m-0">
          <Textarea
            id="editor"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="border-0 rounded-none focus-visible:ring-0 resize-none"
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4 m-0 prose prose-sm max-w-none min-h-[200px]">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: renderPreview() }} />
          ) : (
            <div className="text-muted-foreground italic">Nothing to preview</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
