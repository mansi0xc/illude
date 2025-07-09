"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, ArrowLeft, Plus, Users, Settings, Clock, Edit, ChevronRight, ChevronLeft, List, X } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import localFont from "next/font/local"

const mySoul = localFont({
  src: 'MySoul-Regular.ttf',
  display: 'swap',
})

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
  memory: {
    plotPoints: string[];
    conflicts: string[];
    characterArcs: { characterName: string; currentState: string; developments: string[] }[];
    [key: string]: unknown;
  }
  status: 'draft' | 'active' | 'completed' | 'paused'
  lastUpdated: string
  createdAt: string
}

export default function StoryReaderPage() {
  const [story, setStory] = useState<StoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [showTableOfContents, setShowTableOfContents] = useState(false)
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

  const goToChapter = (index: number) => {
    setCurrentChapterIndex(index)
    setShowTableOfContents(false)
  }

  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
    }
  }

  const goToNextChapter = () => {
    if (story && currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
    }
  }

  const isFirstChapter = currentChapterIndex === 0
  const isLastChapter = story ? currentChapterIndex === story.chapters.length - 1 : false
  const currentChapter = story?.chapters[currentChapterIndex]

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
                This story doesn&apos;t exist or has been removed.
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTableOfContents(true)}
              >
                <List className="w-4 h-4 mr-2" />
                Chapters
              </Button>
              {isLastChapter && (
                <Link href={`/stories/${story._id}/continue`}>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Continue Story
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Table of Contents Modal */}
      {showTableOfContents && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900/95 border-gray-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <List className="w-5 h-5 text-emerald-400" />
                  Table of Contents
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTableOfContents(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {story.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      index === currentChapterIndex
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                    onClick={() => goToChapter(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">
                          Chapter {chapter.chapterNumber}
                          {chapter.title && `: ${chapter.title}`}
                        </h4>
                        {chapter.createdAt && (
                          <p className="text-sm text-gray-500">
                            {formatDate(chapter.createdAt)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Story Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {story.title}
            </h1>
            <Button
              variant="outline"
              size="sm"
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

        {/* Current Chapter */}
        {currentChapter && (
          <Card className="bg-gray-900/50 border-gray-800 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-400">{currentChapter.chapterNumber}</span>
                  </div>
                  Chapter {currentChapter.chapterNumber}
                  {currentChapter.title && `: ${currentChapter.title}`}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {currentChapterIndex + 1} of {story.chapters.length}
                  </span>
                  {currentChapter.createdAt && (
                    <span className="text-sm text-gray-500">
                      • {formatDate(currentChapter.createdAt)}
                    </span>
                  )}
                </div>
              </div>
              
              {currentChapter.userDirection && (
                <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Edit className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">User Direction</span>
                  </div>
                  <p className="text-sm text-gray-300">{currentChapter.userDirection}</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-emerald max-w-none">
                <div className="text-gray-200 leading-relaxed story-content">
                  {currentChapter.content.split('\n').map((line, lineIndex) => {
                    // Check if line starts with ##
                    if (line.trim().startsWith('## ')) {
                      return (
                        <div key={lineIndex} className={`chapter-heading ${mySoul.className}`}>
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

              {currentChapter.aiSummary && (
                <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Chapter Summary</span>
                  </div>
                  <p className="text-sm text-gray-300">{currentChapter.aiSummary}</p>
                </div>
              )}

              {currentChapter.keyEvents && currentChapter.keyEvents.length > 0 && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-400 mb-2">Key Events</h5>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {currentChapter.keyEvents.map((event, eventIndex) => (
                      <li key={eventIndex} className="flex items-start gap-2">
                        <ChevronRight className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chapter Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={goToPreviousChapter}
                  disabled={isFirstChapter}
                  className="flex-1 mr-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Chapter
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowTableOfContents(true)}
                  className="mx-2"
                >
                  <List className="w-4 h-4" />
                </Button>

                {!isLastChapter ? (
                  <Button
                    onClick={goToNextChapter}
                    className="flex-1 ml-4"
                  >
                    Next Chapter
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Link href={`/stories/${story._id}/continue`} className="flex-1 ml-4">
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Continue Story
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex flex-col gap-3">
          <Button 
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
            title="Table of Contents"
            onClick={() => setShowTableOfContents(true)}
          >
            <List className="w-6 h-6" />
          </Button>
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