"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Eye, Clock, FileText, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface StoryPreview {
  _id: string
  title: string
  description: string
  userId?: string
  userEmail?: string
  userName?: string
  status: 'draft' | 'active' | 'completed' | 'paused'
  lastUpdated: string
  createdAt: string
  chapters: { chapterNumber: number; content: string }[]
}

export default function CommunityWorksPage() {
  const [stories, setStories] = useState<StoryPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommunityStories()
  }, [])

  const fetchCommunityStories = async () => {
    try {
      const response = await fetch('/api/community-stories')
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Error fetching community stories:', error)
    } finally {
      setLoading(false)
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

  const getAuthorDisplay = (story: StoryPreview) => {
    if (story.userName) return story.userName
    if (story.userEmail) return story.userEmail.split('@')[0]
    return 'Anonymous'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading community stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="mb-4 text-gray-400 hover:text-emerald-400">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Community Works
              </h1>
              <p className="text-gray-400 mt-2">
                Discover amazing stories created by the Illude community
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">
                {stories.length} {stories.length === 1 ? 'story' : 'stories'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {stories.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              No Community Stories Yet
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Be the first to share your creative work with the community! Create a story and inspire others.
            </p>
            <Link href="/story-generator">
              <Button>
                <Sparkles className="w-4 h-4 mr-2" />
                Create First Story
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card 
                key={story._id} 
                className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {story.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          by {getAuthorDisplay(story)}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(story.status)}>
                      {story.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {story.description && (
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {story.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{story.chapters.length} chapters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(story.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Link href={`/stories/${story._id}`} className="flex-1">
                      <Button size="sm" className="w-full" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Read Story
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 