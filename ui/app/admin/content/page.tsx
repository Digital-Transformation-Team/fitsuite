"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"

import { LanguageSwitcher, type Language } from "@/components/content/language-switcher"
import { NewsForm, type NewsItem } from "@/components/content/news-form"
import { TournamentForm, type Tournament } from "@/components/content/tournament-form"
import { MediaGrid, type MediaItem } from "@/components/content/media-grid"
import { NotificationForm, type Notification } from "@/components/content/notification-form"

// Sample data
const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
]

const newsData: NewsItem[] = [
  {
    id: "1",
    title: "New Tennis Courts Opening",
    content: "We are excited to announce the opening of our new tennis courts next month...",
    publishDate: "2025-06-15T10:00:00Z",
    published: true,
    language: "en",
  },
  {
    id: "2",
    title: "Summer Fitness Challenge",
    content: "Join our summer fitness challenge and win exciting prizes...",
    publishDate: "2025-05-25T08:30:00Z",
    published: true,
    language: "en",
  },
  {
    id: "3",
    title: "Nuevas Canchas de Tenis",
    content: "Estamos emocionados de anunciar la apertura de nuestras nuevas canchas de tenis...",
    publishDate: "2025-06-15T10:00:00Z",
    published: true,
    language: "es",
  },
]

const tournamentsData: Tournament[] = [
  {
    id: "1",
    name: "Summer Tennis Championship",
    description: "Annual tennis championship with categories for all ages and skill levels.",
    startDate: "2025-07-10T09:00:00Z",
    endDate: "2025-07-15T18:00:00Z",
    status: "upcoming",
    location: "Main Tennis Courts",
    registrationUrl: "https://example.com/register",
    language: "en",
    maxParticipants: 64,
    currentParticipants: 42,
  },
  {
    id: "2",
    name: "Basketball Tournament",
    description: "3v3 basketball tournament for amateur players.",
    startDate: "2025-06-05T10:00:00Z",
    endDate: "2025-06-07T19:00:00Z",
    status: "upcoming",
    location: "Indoor Basketball Court",
    language: "en",
    maxParticipants: 24,
    currentParticipants: 18,
  },
  {
    id: "3",
    name: "Campeonato de Tenis de Verano",
    description: "Campeonato anual de tenis con categorías para todas las edades y niveles.",
    startDate: "2025-07-10T09:00:00Z",
    endDate: "2025-07-15T18:00:00Z",
    status: "upcoming",
    location: "Canchas Principales de Tenis",
    registrationUrl: "https://example.com/register",
    language: "es",
    maxParticipants: 64,
    currentParticipants: 42,
  },
]

const mediaData: MediaItem[] = [
  {
    id: "1",
    type: "image",
    url: "/placeholder.svg?height=300&width=400&text=Tennis+Courts",
    title: "Tennis Courts",
    description: "Our newly renovated tennis courts",
    dateUploaded: "2025-04-15T14:30:00Z",
  },
  {
    id: "2",
    type: "image",
    url: "/placeholder.svg?height=300&width=400&text=Gym+Facilities",
    title: "Gym Facilities",
    description: "State-of-the-art gym equipment",
    dateUploaded: "2025-04-10T11:15:00Z",
  },
  {
    id: "3",
    type: "video",
    url: "/placeholder.svg?height=300&width=400&text=Workout+Video",
    title: "Workout Tutorial",
    description: "15-minute full body workout",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Workout+Thumbnail",
    dateUploaded: "2025-04-05T09:45:00Z",
  },
  {
    id: "4",
    type: "image",
    url: "/placeholder.svg?height=300&width=400&text=Swimming+Pool",
    title: "Swimming Pool",
    description: "Olympic-sized swimming pool",
    dateUploaded: "2025-03-28T16:20:00Z",
  },
]

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("news")
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [news, setNews] = useState<NewsItem[]>(newsData)
  const [tournaments, setTournaments] = useState<Tournament[]>(tournamentsData)
  const [media, setMedia] = useState<MediaItem[]>(mediaData)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNewsForm, setShowNewsForm] = useState(false)
  const [showTournamentForm, setShowTournamentForm] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | undefined>(undefined)
  const [editingTournament, setEditingTournament] = useState<Tournament | undefined>(undefined)

  // Filter data by current language
  const filteredNews = news.filter((item) => item.language === currentLanguage)
  const filteredTournaments = tournaments.filter((item) => item.language === currentLanguage)

  // Handle language change
  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode)
  }

  // News handlers
  const handleAddNews = (newsItem: Omit<NewsItem, "id">) => {
    const newItem = {
      ...newsItem,
      id: Math.random().toString(36).substring(7),
    }
    setNews([...news, newItem])
    setShowNewsForm(false)
  }

  const handleUpdateNews = (newsItem: Omit<NewsItem, "id">) => {
    if (editingNews) {
      setNews(news.map((item) => (item.id === editingNews.id ? { ...newsItem, id: editingNews.id } : item)))
      setEditingNews(undefined)
      setShowNewsForm(false)
    }
  }

  const handleDeleteNews = (id: string) => {
    setNews(news.filter((item) => item.id !== id))
  }

  const handleEditNews = (newsItem: NewsItem) => {
    setEditingNews(newsItem)
    setShowNewsForm(true)
  }

  // Tournament handlers
  const handleAddTournament = (tournament: Omit<Tournament, "id">) => {
    const newTournament = {
      ...tournament,
      id: Math.random().toString(36).substring(7),
    }
    setTournaments([...tournaments, newTournament])
    setShowTournamentForm(false)
  }

  const handleUpdateTournament = (tournament: Omit<Tournament, "id">) => {
    if (editingTournament) {
      setTournaments(
        tournaments.map((item) =>
          item.id === editingTournament.id ? { ...tournament, id: editingTournament.id } : item,
        ),
      )
      setEditingTournament(undefined)
      setShowTournamentForm(false)
    }
  }

  const handleDeleteTournament = (id: string) => {
    setTournaments(tournaments.filter((item) => item.id !== id))
  }

  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setShowTournamentForm(true)
  }

  // Media handlers
  const handleUploadMedia = (file: File, metadata: { title: string; description: string }) => {
    // In a real app, you would upload the file to a server and get a URL back
    const newMedia: MediaItem = {
      id: Math.random().toString(36).substring(7),
      type: file.type.startsWith("image/") ? "image" : "video",
      url: URL.createObjectURL(file), // This is temporary and will be lost on page refresh
      title: metadata.title,
      description: metadata.description,
      dateUploaded: new Date().toISOString(),
    }
    setMedia([...media, newMedia])
  }

  const handleDeleteMedia = (id: string) => {
    setMedia(media.filter((item) => item.id !== id))
  }

  const handleEditMedia = (id: string, metadata: { title: string; description: string }) => {
    setMedia(
      media.map((item) =>
        item.id === id
          ? {
              ...item,
              title: metadata.title,
              description: metadata.description,
            }
          : item,
      ),
    )
  }

  // Notification handlers
  const handleSendNotification = (notification: Omit<Notification, "id">) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
    }
    setNotifications([...notifications, newNotification])
    // In a real app, you would send the notification to a server
    alert(`Notification "${notification.title}" will be sent to ${notification.targetAudience} users.`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
          <LanguageSwitcher
            languages={languages}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="media">Media Gallery</TabsTrigger>
            <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          </TabsList>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>News Articles</CardTitle>
                  <CardDescription>
                    Manage news articles for your website. Current language:{" "}
                    {languages.find((l) => l.code === currentLanguage)?.name}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingNews(undefined)
                    setShowNewsForm(!showNewsForm)
                  }}
                >
                  {showNewsForm ? (
                    "Cancel"
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Add News
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {showNewsForm ? (
                  <NewsForm
                    item={editingNews}
                    onSave={editingNews ? handleUpdateNews : handleAddNews}
                    language={currentLanguage}
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Publish Date
                            </div>
                          </TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredNews.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                              No news articles found for this language.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredNews.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{format(new Date(item.publishDate), "PPP")}</TableCell>
                              <TableCell>
                                <Badge variant={item.published ? "success" : "outline"}>
                                  {item.published ? "Published" : "Draft"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditNews(item)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                    onClick={() => handleDeleteNews(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tournaments</CardTitle>
                  <CardDescription>
                    Manage tournaments and competitions. Current language:{" "}
                    {languages.find((l) => l.code === currentLanguage)?.name}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setEditingTournament(undefined)
                    setShowTournamentForm(!showTournamentForm)
                  }}
                >
                  {showTournamentForm ? (
                    "Cancel"
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Add Tournament
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {showTournamentForm ? (
                  <TournamentForm
                    tournament={editingTournament}
                    onSave={editingTournament ? handleUpdateTournament : handleAddTournament}
                    language={currentLanguage}
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Dates
                            </div>
                          </TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTournaments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No tournaments found for this language.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTournaments.map((tournament) => (
                            <TableRow key={tournament.id}>
                              <TableCell className="font-medium">{tournament.name}</TableCell>
                              <TableCell>
                                {format(new Date(tournament.startDate), "MMM d")} -{" "}
                                {format(new Date(tournament.endDate), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>{tournament.location}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    tournament.status === "upcoming"
                                      ? "outline"
                                      : tournament.status === "ongoing"
                                        ? "success"
                                        : tournament.status === "completed"
                                          ? "default"
                                          : "destructive"
                                  }
                                >
                                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {tournament.currentParticipants}/{tournament.maxParticipants}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditTournament(tournament)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                    onClick={() => handleDeleteTournament(tournament.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Gallery Tab */}
          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
                <CardDescription>Upload and manage images and videos for your website.</CardDescription>
              </CardHeader>
              <CardContent>
                <MediaGrid
                  items={media}
                  onUpload={handleUploadMedia}
                  onDelete={handleDeleteMedia}
                  onEdit={handleEditMedia}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Push Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>
                  Send push notifications to your users. Current language:{" "}
                  {languages.find((l) => l.code === currentLanguage)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationForm onSend={handleSendNotification} language={currentLanguage} />
              </CardContent>
            </Card>

            {notifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Target Audience</TableHead>
                          <TableHead>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Scheduled For
                            </div>
                          </TableHead>
                          <TableHead>Language</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notifications
                          .filter((n) => n.language === currentLanguage)
                          .map((notification) => (
                            <TableRow key={notification.id}>
                              <TableCell className="font-medium">{notification.title}</TableCell>
                              <TableCell>
                                {notification.targetAudience === "custom"
                                  ? "Custom Groups"
                                  : notification.targetAudience.charAt(0).toUpperCase() +
                                    notification.targetAudience.slice(1)}
                              </TableCell>
                              <TableCell>
                                {notification.scheduledFor
                                  ? format(new Date(notification.scheduledFor), "PPP p")
                                  : "Immediate"}
                              </TableCell>
                              <TableCell>{languages.find((l) => l.code === notification.language)?.name}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
