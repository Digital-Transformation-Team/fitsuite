"use client"

import type React from "react"

import { useState } from "react"
import { FileImage, FileVideo, MoreVertical, Plus, Trash2, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description?: string
  thumbnail?: string
  dateUploaded: string
}

interface MediaGridProps {
  items: MediaItem[]
  onUpload: (file: File, metadata: { title: string; description: string }) => void
  onDelete: (id: string) => void
  onEdit: (id: string, metadata: { title: string; description: string }) => void
}

export function MediaGrid({ items, onUpload, onDelete, onEdit }: MediaGridProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setSelectedFile(file)
      setTitle(file.name.split(".")[0])
      setIsUploadDialogOpen(true)
    } else {
      alert("Please select an image or video file.")
    }
  }

  const handleUploadSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile, { title, description })
      setSelectedFile(null)
      setTitle("")
      setDescription("")
      setIsUploadDialogOpen(false)
    }
  }

  const handleEditSubmit = () => {
    if (selectedItem) {
      onEdit(selectedItem.id, { title, description })
      setSelectedItem(null)
      setTitle("")
      setDescription("")
      setIsEditDialogOpen(false)
    }
  }

  const openEditDialog = (item: MediaItem) => {
    setSelectedItem(item)
    setTitle(item.title)
    setDescription(item.description || "")
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          dragActive ? "border-primary bg-primary/5" : "border-border",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">Drag and drop files</h3>
          <p className="text-sm text-muted-foreground">or click to browse (max 10MB per file)</p>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0])
              }
            }}
          />
          <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {item.type === "image" ? (
                <img src={item.url || "/placeholder.svg"} alt={item.title} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <FileVideo className="h-12 w-12 text-muted-foreground" />
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="object-cover w-full h-full opacity-50"
                  />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 text-white hover:bg-black/70">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditDialog(item)}>Edit details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(item.url, "_blank")}>View full size</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => onDelete(item.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                {item.type === "image" ? (
                  <FileImage className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                ) : (
                  <FileVideo className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <h3 className="font-medium truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{new Date(item.dateUploaded).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditDialog(item)}>
                <span className="sr-only">Edit</span>
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600" onClick={() => onDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>Add details to your media file. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            {selectedFile && selectedFile.type.startsWith("image/") && (
              <div className="grid gap-2">
                <Label>Preview</Label>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogDescription>Update the details of your media file. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            {selectedItem && (
              <div className="grid gap-2">
                <Label>Preview</Label>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  {selectedItem.type === "image" ? (
                    <img
                      src={selectedItem.url || "/placeholder.svg"}
                      alt={selectedItem.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <FileVideo className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
