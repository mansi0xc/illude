"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Eye, Trash2, Plus, ArrowLeft, Clock, FileText, LogIn, Bookmark, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import { useSession, signIn } from "next-auth/react"

interface StoryPreview {
  _id: string
  title: string
  description: string
  userId: string
  userEmail: string
  userName?: string
  status: 'draft' | 'active' | 'completed' | 'paused'
  lastUpdated: string
  createdAt: string
  chapters: { chapterNumber: number; content: string }[]
}

export default function StoriesPage() {
  const { data: session, status } = useSession()
  const [stories, setStories] = useState<StoryPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [bookmarkedStories, setBookmarkedStories] = useState<Set<string>>(new Set())
  const [bookmarkingStory, setBookmarkingStory] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }
    if (session) {
      fetchStories()
    }
  }, [session, status])

  const fetchStories = async () => {
    try {
      const [storiesResponse, bookmarksResponse] = await Promise.all([
        fetch('/api/stories'),
        fetch('/api/user/bookmarks')
      ])
      
      const storiesData = await storiesResponse.json()
      const bookmarksData = await bookmarksResponse.json()
      
      if (!storiesResponse.ok) {
        throw new Error(storiesData.error || 'Failed to fetch stories')
      }
      
      setStories(storiesData.stories || [])
      
      if (bookmarksResponse.ok && bookmarksData.bookmarks) {
        setBookmarkedStories(new Set(bookmarksData.bookmarks.map((id: string) => id.toString())))
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return
    }

    setDeleting(storyId)
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setStories(stories.filter(story => story._id !== storyId))
      } else {
        console.error('Failed to delete story')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
    } finally {
      setDeleting(null)
    }
  }

  const toggleBookmark = async (storyId: string) => {
    if (!session?.user?.id) return
    
    setBookmarkingStory(storyId)
    try {
      const isBookmarked = bookmarkedStories.has(storyId)
      const response = await fetch('/api/user/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId,
          action: isBookmarked ? 'remove' : 'add'
        }),
      })

      if (response.ok) {
        const newBookmarked = new Set(bookmarkedStories)
        if (isBookmarked) {
          newBookmarked.delete(storyId)
        } else {
          newBookmarked.add(storyId)
        }
        setBookmarkedStories(newBookmarked)
      } else {
        console.error('Failed to toggle bookmark')
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setBookmarkingStory(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <ArrowLeft className="w-5 h-5 text-emerald-400" />
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold">Illude</span>
                </Link>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <BookOpen className="w-3 h-3 mr-1" />
                My Stories
              </Badge>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
            <p className="text-gray-400">Loading your stories...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white">
        <nav className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <ArrowLeft className="w-5 h-5 text-emerald-400" />
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold">Illude</span>
                </Link>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <BookOpen className="w-3 h-3 mr-1" />
                My Stories
              </Badge>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Sign In Required</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Please sign in with your Google account to view and manage your personal stories.
            </p>
            <Button 
              onClick={() => signIn('google')}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In with Google
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-5 h-5 text-emerald-400" />
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold">Illude</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <BookOpen className="w-3 h-3 mr-1" />
                My Stories
              </Badge>
              <Link href="/story-generator">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Your
            <span className="block text-emerald-400">Story Collection</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Continue your ongoing adventures or start a new epic tale
          </p>
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Stories Yet</h3>
              <p className="text-gray-400 mb-8">
                Start your creative journey by generating your first story with our AI-powered storyteller.
              </p>
              <Link href="/story-generator">
                <Button size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create Your First Story
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story._id} className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getStatusColor(story.status)}>
                      {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                    </Badge>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      onClick={() => deleteStory(story._id)}
                      disabled={deleting === story._id}
                    >
                      {deleting === story._id ? (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">
                    {story.title}
                  </CardTitle>
                  {story.userEmail && (
                    <p className="text-sm text-gray-500 mt-1">
                      by {story.userName || story.userEmail.split('@')[0]}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {story.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{story.chapters.length} chapter{story.chapters.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(story.lastUpdated)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/stories/${story._id}`} className="flex-1">
                      <Button className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Read Story
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="px-3"
                      onClick={() => toggleBookmark(story._id)}
                      disabled={bookmarkingStory === story._id}
                      title={bookmarkedStories.has(story._id) ? "Remove bookmark" : "Bookmark story"}
                    >
                      {bookmarkingStory === story._id ? (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      ) : bookmarkedStories.has(story._id) ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3">
          <Link href="/story-generator">
            <Button 
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
              title="Create New Story"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/">
            <Button 
              variant="outline"
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm"
              title="Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 