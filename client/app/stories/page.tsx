"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Users, Eye, Trash2, Plus, ArrowLeft, Clock, FileText } from "lucide-react"
import Link from "next/link"

interface StoryPreview {
  _id: string
  title: string
  description: string
  status: 'draft' | 'active' | 'completed' | 'paused'
  lastUpdated: string
  createdAt: string
  chapters: any[]
}

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories')
      const data = await response.json()
      setStories(data.stories || [])
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

  if (loading) {
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
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
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
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <BookOpen className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">No Stories Yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Your story collection is empty. Create your first epic adventure and watch your imagination come to life!
            </p>
            <Link href="/story-generator">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Story
              </Button>
            </Link>
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
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
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

                  <div className="flex gap-2 pt-2">
                    <Link href={`/stories/${story._id}`} className="flex-1">
                      <Button className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30">
                        <Eye className="w-4 h-4 mr-2" />
                        Read Story
                      </Button>
                    </Link>
                    <Link href={`/stories/${story._id}/continue`}>
                      <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </Link>
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
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/25 flex items-center justify-center"
              title="Create New Story"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/">
            <Button 
              variant="outline"
              className="w-14 h-14 rounded-full border-gray-700 bg-gray-900/90 hover:bg-gray-800 text-gray-300 shadow-lg flex items-center justify-center backdrop-blur-sm"
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