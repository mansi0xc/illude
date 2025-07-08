"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, ArrowLeft, Plus, Users, Settings, Clock, Edit, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Chapter {
  chapterNumber: number
  title?: string
  content: string
  userDirection?: string
  aiSummary?: string
  keyEvents?: string[]
  charactersInvolved?: string[]
  newPlotPoints?: string[]
  createdAt?: string
}

interface Character {
  name: string
  appearance?: string
  personality?: string
  background?: string
  goals?: string
  backstory?: string
  relationships?: string
  currentState?: string
  arcs?: string[]
}

interface StoryData {
  _id: string
  title: string
  description: string
  characters: Character[]
  settings: string
  worldbuilding: string[]
  powerSystem: string[]
  magicSystem: string[]
  technologySystem: string[]
  rules: string[]
  lore: string[]
  history: string[]
  culture: string[]
  plot: string
  conflict: string
  chapters: Chapter[]
  memory: any
  status: 'draft' | 'active' | 'completed' | 'paused'
  lastUpdated: string
  createdAt: string
}

export default function StoryReaderPage() {
  const [story, setStory] = useState<StoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      fetchStory(params.id as string)
    }
  }, [params.id])

  const fetchStory = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`)
      const data = await response.json()
      setStory(data.story)
    } catch (error) {
      console.error('Error fetching story:', error)
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
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
            <p className="text-gray-400">Loading your story...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Story Not Found</h3>
              <p className="text-gray-400 mb-8">
                This story doesn't exist or has been removed.
              </p>
              <Link href="/stories">
                <Button size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Stories
                </Button>
              </Link>
            </div>
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
              <Link href="/stories" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-5 h-5 text-emerald-400" />
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold">Illude</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(story.status)}>
                {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
              </Badge>
              <Link href={`/stories/${story._id}/continue`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Continue Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Story Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {story.title}
            </h1>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          
          {story.description && (
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              {story.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{story.chapters.length} chapter{story.chapters.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{story.characters.length} character{story.characters.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last updated {formatDate(story.lastUpdated)}</span>
            </div>
          </div>

          {/* Story Details */}
          {showDetails && (
            <Card className="bg-gray-900/50 border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  Story Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {story.settings && (
                  <div>
                    <h4 className="font-semibold text-emerald-400 mb-2">Setting</h4>
                    <p className="text-gray-300">{story.settings}</p>
                  </div>
                )}

                {story.plot && (
                  <div>
                    <h4 className="font-semibold text-emerald-400 mb-2">Plot</h4>
                    <p className="text-gray-300">{story.plot}</p>
                  </div>
                )}

                {story.conflict && (
                  <div>
                    <h4 className="font-semibold text-emerald-400 mb-2">Central Conflict</h4>
                    <p className="text-gray-300">{story.conflict}</p>
                  </div>
                )}

                {story.characters.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-emerald-400 mb-2">Characters</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {story.characters.map((character, index) => (
                        <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                          <h5 className="font-semibold text-white mb-1">{character.name}</h5>
                          {character.personality && (
                            <p className="text-sm text-gray-400">{character.personality}</p>
                          )}
                          {character.goals && (
                            <p className="text-sm text-gray-500 mt-1">Goals: {character.goals}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chapters */}
        <div className="space-y-8">
          {story.chapters.map((chapter, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-400">{chapter.chapterNumber}</span>
                    </div>
                    Chapter {chapter.chapterNumber}
                    {chapter.title && `: ${chapter.title}`}
                  </CardTitle>
                  {chapter.createdAt && (
                    <span className="text-sm text-gray-500">
                      {formatDate(chapter.createdAt)}
                    </span>
                  )}
                </div>
                
                {chapter.userDirection && (
                  <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Edit className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">User Direction</span>
                    </div>
                    <p className="text-sm text-gray-300">{chapter.userDirection}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert prose-emerald max-w-none">
                  <div className="text-gray-200 leading-relaxed story-content">
                    {chapter.content.split('\n').map((line, lineIndex) => {
                      // Check if line starts with ##
                      if (line.trim().startsWith('## ')) {
                        return (
                          <div key={lineIndex} className="chapter-heading">
                            {line.trim().replace(/^## /, '')}
                          </div>
                        )
                      }
                      // Regular line
                      return (
                        <div key={lineIndex}>
                          {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {chapter.aiSummary && (
                  <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Chapter Summary</span>
                    </div>
                    <p className="text-sm text-gray-300">{chapter.aiSummary}</p>
                  </div>
                )}

                {chapter.keyEvents && chapter.keyEvents.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-400 mb-2">Key Events</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {chapter.keyEvents.map((event, eventIndex) => (
                        <li key={eventIndex} className="flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Story CTA */}
        <div className="mt-12 text-center">
          <div className="p-8 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent rounded-xl border border-emerald-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Continue Your Adventure</h3>
            <p className="text-gray-300 mb-6">
              Ready to see what happens next? Let the AI continue your story or guide it with your own direction.
            </p>
            <div className="text-center space-y-4">
              <Link href={`/stories/${story._id}/continue`}>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Continue Story
                </Button>
              </Link>
              <Link href="/stories">
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  All Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3">
          <Link href={`/stories/${story._id}/continue`}>
            <Button 
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
              title="Continue Story"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/stories">
            <Button 
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
              title="All Stories"
            >
              <BookOpen className="w-6 h-6" />
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