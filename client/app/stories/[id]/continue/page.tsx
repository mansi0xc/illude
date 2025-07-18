"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, ArrowLeft, Wand2, Edit, Eye, Users, Settings, Bot, User, Lock, LogIn } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useSession, signIn } from "next-auth/react"

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

interface StoryData {
  _id: string
  title: string
  description: string
  userId: string
  userEmail: string
  userName?: string
  characters: { name: string; personality?: string; goals?: string }[]
  chapters: Chapter[]
  memory: {
    plotPoints: string[];
    conflicts: string[];
    characterArcs: { characterName: string; currentState: string; developments: string[] }[];
    [key: string]: unknown;
  }
  status: 'draft' | 'active' | 'completed' | 'paused'
  lastUpdated: string
}

export default function ContinueStoryPage() {
  const { data: session, status } = useSession()
  const [story, setStory] = useState<StoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generateType, setGenerateType] = useState<'ai' | 'user-directed'>('ai')
  const [userDirection, setUserDirection] = useState('')
  const [newChapter, setNewChapter] = useState<Chapter | null>(null)
  const [showMemory, setShowMemory] = useState(false)
  
  const params = useParams()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }
    if (params.id && session) {
      fetchStory(params.id as string)
    }
  }, [params.id, session, status])

  const fetchStory = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch story')
      }
      
      setStory(data.story)
    } catch (error) {
      console.error('Error fetching story:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateChapter = async () => {
    if (!story) return

    setGenerating(true)
    try {
      const response = await fetch(`/api/stories/${story._id}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generateType,
          userDirection: generateType === 'user-directed' ? userDirection : ''
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setNewChapter(data.chapter)
        setStory(data.story) // Update story with new chapter
        setUserDirection('') // Clear user direction
      } else {
        console.error('Error generating chapter:', data.error)
        alert('Failed to generate chapter. Please try again.')
      }
    } catch (error) {
      console.error('Error generating chapter:', error)
      alert('Failed to generate chapter. Please try again.')
    } finally {
      setGenerating(false)
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

  if (loading || status === 'loading') {
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

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Sign In Required</h3>
            <p className="text-gray-400 mb-8">
              Please sign in to continue writing your story.
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

  if (!story) {
    return (
      <div className="min-h-screen bg-black text-white">
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
    )
  }

  // Check if user owns this story
  if (story.userId !== session?.user?.id) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Access Denied</h3>
            <p className="text-gray-400 mb-8">
              You can only continue stories that you have created. This story belongs to someone else.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={`/stories/${story._id}`}>
                <Button size="lg" variant="outline">
                  <Eye className="w-5 h-5 mr-2" />
                  Read Only
                </Button>
              </Link>
              <Link href="/stories">
                <Button size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  My Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const nextChapterNumber = story.chapters.length + 1
  const lastChapter = story.chapters[story.chapters.length - 1]
  const textareaClass = "w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors resize-vertical min-h-[120px]"

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href={`/stories/${story._id}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
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
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Wand2 className="w-3 h-3 mr-1" />
                Continue Story
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Story Context & Generation Options */}
          <div className="space-y-6">
            {/* Story Info */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  {story.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{story.chapters.length} chapter{story.chapters.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{story.characters.length} character{story.characters.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {story.description && (
                  <p className="text-gray-300 text-sm">{story.description}</p>
                )}

                <div className="flex gap-2">
                  <Link href={`/stories/${story._id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Read Story
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setShowMemory(!showMemory)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Story Memory */}
            {showMemory && story.memory && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-emerald-400" />
                    Story Memory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {story.memory.plotPoints && story.memory.plotPoints.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-emerald-400 mb-2">Plot Points</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {story.memory.plotPoints.map((point: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {story.memory.conflicts && story.memory.conflicts.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-emerald-400 mb-2">Active Conflicts</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {story.memory.conflicts.map((conflict: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                            {conflict}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {story.memory.characterArcs && story.memory.characterArcs.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-emerald-400 mb-2">Character Arcs</h4>
                      <div className="space-y-2">
                        {story.memory.characterArcs.map((arc: { characterName: string; currentState: string; developments: string[] }, index: number) => (
                          <div key={index} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                            <div className="font-medium text-white text-sm">{arc.characterName}</div>
                            <div className="text-xs text-gray-400">Current: {arc.currentState}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Last Chapter Preview */}
            {lastChapter && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    Chapter {lastChapter.chapterNumber} (Previous)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {lastChapter.content.length > 500 
                      ? `${lastChapter.content.substring(0, 500)}...` 
                      : lastChapter.content
                    }
                  </div>
                  {lastChapter.aiSummary && (
                    <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">Summary</span>
                      </div>
                      <p className="text-sm text-gray-300">{lastChapter.aiSummary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Generation Options */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-emerald-400" />
                  Generate Chapter {nextChapterNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Generation Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Generation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={generateType === 'ai' ? 'default' : 'outline'}
                      onClick={() => setGenerateType('ai')}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      <Bot className="w-5 h-5" />
                      <span className="text-sm">AI Continues</span>
                    </Button>
                    <Button
                      variant={generateType === 'user-directed' ? 'default' : 'outline'}
                      onClick={() => setGenerateType('user-directed')}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm">I&apos;ll Guide</span>
                    </Button>
                  </div>
                </div>

                {/* User Direction Input */}
                {generateType === 'user-directed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Direction for Chapter {nextChapterNumber}
                    </label>
                    <textarea
                      placeholder="Describe what should happen next in the story..."
                      className={textareaClass}
                      value={userDirection}
                      onChange={(e) => setUserDirection(e.target.value)}
                    />
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={generateChapter}
                  disabled={generating || (generateType === 'user-directed' && !userDirection.trim())}
                  className="w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Generating Chapter {nextChapterNumber}...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Chapter {nextChapterNumber}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Generated Chapter Display */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="bg-gray-900/50 border-gray-800 min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  {newChapter ? `Chapter ${newChapter.chapterNumber}` : `Chapter ${nextChapterNumber} Preview`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {newChapter ? (
                  <div className="space-y-6">
                    {newChapter.userDirection && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Edit className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">Your Direction</span>
                        </div>
                        <p className="text-sm text-gray-300">{newChapter.userDirection}</p>
                      </div>
                    )}

                    <div className="prose prose-invert prose-emerald max-w-none">
                      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                          {newChapter.content}
                        </div>
                      </div>
                    </div>

                    {newChapter.aiSummary && (
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-400">AI Summary</span>
                        </div>
                        <p className="text-sm text-gray-300">{newChapter.aiSummary}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setNewChapter(null)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Link href={`/stories/${story._id}`} className="flex-1">
                        <Button className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Read Full Story
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                      <Wand2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Ready to Continue</h3>
                    <p className="text-gray-400 max-w-sm">
                      Choose your generation mode and create the next chapter of your epic story.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col gap-3">
          <Link href={`/stories/${story._id}`}>
            <Button 
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
              title="Read Full Story"
            >
              <Eye className="w-6 h-6" />
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