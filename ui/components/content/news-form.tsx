"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "./rich-text-editor"
import { cn } from "@/lib/utils"

export interface NewsItem {
  id: string
  title: string
  content: string
  publishDate: string
  published: boolean
  language: string
  slug?: string
  author?: string
  featuredImage?: string
  categories?: string[]
}

interface NewsFormProps {
  item?: NewsItem
  onSave: (item: Omit<NewsItem, "id">) => void
  language: string
}

export function NewsForm({ item, onSave, language }: NewsFormProps) {
  const [title, setTitle] = useState(item?.title || "")
  const [content, setContent] = useState(item?.content || "")
  const [publishDate, setPublishDate] = useState<Date>(item?.publishDate ? new Date(item.publishDate) : new Date())
  const [published, setPublished] = useState(item?.published || false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      content,
      publishDate: publishDate.toISOString(),
      published,
      language,
    })
    if (!item) {
      // Clear form if it's a new item
      setTitle("")
      setContent("")
      setPublishDate(new Date())
      setPublished(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter news title"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            initialValue={content}
            onChange={setContent}
            placeholder="Write your news content here..."
            minHeight="300px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="publish-date">Publish Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !publishDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {publishDate ? format(publishDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={publishDate}
                  onSelect={(date) => date && setPublishDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="published">Status</Label>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="published">Published</Label>
                <div className="text-sm text-muted-foreground">
                  {published ? "This news item is live" : "This news item is a draft"}
                </div>
              </div>
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">{item ? "Update" : "Create"} News</Button>
      </div>
    </form>
  )
}
