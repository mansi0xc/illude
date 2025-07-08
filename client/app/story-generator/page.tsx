"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, Trash2, BookOpen, Users, Zap, Settings, Scroll, Wand2, ArrowLeft, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Character {
  name: string
  appearance: string
  personality: string
  background: string
  goals: string
  backstory: string
  relationships: string
}

interface Story {
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
}

function StoryGeneratorContent() {
  const searchParams = useSearchParams()
  const storyId = searchParams.get('storyId')
  
  const [story, setStory] = useState<Story>({
    title: "",
    description: "",
    characters: [{ name: "", appearance: "", personality: "", background: "", goals: "", backstory: "", relationships: "" }],
    settings: "",
    worldbuilding: [""],
    powerSystem: [""],
    magicSystem: [""],
    technologySystem: [""],
    rules: [""],
    lore: [""],
    history: [""],
    culture: [""],
    plot: "",
    conflict: ""
  })

  const [generatedChapter, setGeneratedChapter] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const addCharacter = () => {
    setStory(prev => ({
      ...prev,
      characters: [...prev.characters, { name: "", appearance: "", personality: "", background: "", goals: "", backstory: "", relationships: "" }]
    }))
  }

  const removeCharacter = (index: number) => {
    setStory(prev => ({
      ...prev,
      characters: prev.characters.filter((_, i) => i !== index)
    }))
  }

  const updateCharacter = (index: number, field: keyof Character, value: string) => {
    setStory(prev => ({
      ...prev,
      characters: prev.characters.map((char, i) => 
        i === index ? { ...char, [field]: value } : char
      )
    }))
  }

  const addArrayItem = (field: keyof Pick<Story, 'worldbuilding' | 'powerSystem' | 'magicSystem' | 'technologySystem' | 'rules' | 'lore' | 'history' | 'culture'>) => {
    setStory(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: keyof Pick<Story, 'worldbuilding' | 'powerSystem' | 'magicSystem' | 'technologySystem' | 'rules' | 'lore' | 'history' | 'culture'>, index: number) => {
    setStory(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const updateArrayItem = (field: keyof Pick<Story, 'worldbuilding' | 'powerSystem' | 'magicSystem' | 'technologySystem' | 'rules' | 'lore' | 'history' | 'culture'>, index: number, value: string) => {
    setStory(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const generateChapter = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/initStory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story }),
      })
      
      const data = await response.json()
      if (response.ok) {
        setGeneratedChapter(data.chapter)
        // Store the story ID for navigation
        if (data.storyId) {
          window.history.replaceState({}, '', `/story-generator?storyId=${data.storyId}`)
        }
      } else {
        console.error('Error generating chapter:', data.error)
        alert('Failed to generate chapter. Please try again.')
      }
    } catch (error) {
      console.error('Error generating chapter:', error)
      alert('Failed to generate chapter. Please try again.')
    }
    setIsGenerating(false)
  }

  const inputClass = "w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors"
  const textareaClass = "w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors resize-vertical min-h-[100px]"

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
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Wand2 className="w-3 h-3 mr-1" />
              Story Generator
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Create Your
            <span className="block text-emerald-400">Epic Story</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Fill in the details below to craft a compelling narrative. The AI will generate your first chapter based on your creative vision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Story Form */}
          <div className="space-y-6">
            {/* Basic Story Info */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Story Basics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Story Title</label>
                  <input
                    type="text"
                    placeholder="Enter your story title..."
                    className={inputClass}
                    value={story.title}
                    onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    placeholder="Brief description of your story..."
                    className={textareaClass}
                    value={story.description}
                    onChange={(e) => setStory(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Main Plot</label>
                  <textarea
                    placeholder="What is the main storyline?"
                    className={textareaClass}
                    value={story.plot}
                    onChange={(e) => setStory(prev => ({ ...prev, plot: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Central Conflict</label>
                  <textarea
                    placeholder="What is the main conflict or tension?"
                    className={textareaClass}
                    value={story.conflict}
                    onChange={(e) => setStory(prev => ({ ...prev, conflict: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Characters */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Characters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {story.characters.map((character, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-emerald-400">Character {index + 1}</h4>
                      {story.characters.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeCharacter(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          placeholder="Character name"
                          className={inputClass}
                          value={character.name}
                          onChange={(e) => updateCharacter(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Appearance</label>
                        <input
                          type="text"
                          placeholder="Physical appearance"
                          className={inputClass}
                          value={character.appearance}
                          onChange={(e) => updateCharacter(index, 'appearance', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Personality</label>
                        <input
                          type="text"
                          placeholder="Key personality traits"
                          className={inputClass}
                          value={character.personality}
                          onChange={(e) => updateCharacter(index, 'personality', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Background</label>
                        <input
                          type="text"
                          placeholder="Character background"
                          className={inputClass}
                          value={character.background}
                          onChange={(e) => updateCharacter(index, 'background', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Goals</label>
                        <input
                          type="text"
                          placeholder="What do they want?"
                          className={inputClass}
                          value={character.goals}
                          onChange={(e) => updateCharacter(index, 'goals', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Backstory</label>
                        <input
                          type="text"
                          placeholder="Important past events"
                          className={inputClass}
                          value={character.backstory}
                          onChange={(e) => updateCharacter(index, 'backstory', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Relationships</label>
                        <input
                          type="text"
                          placeholder="Relationships with other characters"
                          className={inputClass}
                          value={character.relationships}
                          onChange={(e) => updateCharacter(index, 'relationships', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addCharacter}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Character
                </Button>
              </CardContent>
            </Card>

            {/* World Building */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  World & Setting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Settings</label>
                  <textarea
                    placeholder="Describe the main setting/location..."
                    className={textareaClass}
                    value={story.settings}
                    onChange={(e) => setStory(prev => ({ ...prev, settings: e.target.value }))}
                  />
                </div>

                {/* Dynamic Arrays */}
                {[
                  { key: 'worldbuilding' as const, label: 'World Building Elements', icon: Scroll },
                  { key: 'powerSystem' as const, label: 'Power System', icon: Zap },
                  { key: 'magicSystem' as const, label: 'Magic System', icon: Sparkles },
                  { key: 'technologySystem' as const, label: 'Technology System', icon: Settings },
                  { key: 'rules' as const, label: 'World Rules', icon: BookOpen },
                  { key: 'lore' as const, label: 'Lore & Mythology', icon: Scroll },
                  { key: 'history' as const, label: 'Historical Events', icon: BookOpen },
                  { key: 'culture' as const, label: 'Cultural Elements', icon: Users }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      {label}
                    </label>
                    <div className="space-y-2">
                      {story[key].map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Add ${label.toLowerCase()}...`}
                            className={inputClass}
                            value={item}
                            onChange={(e) => updateArrayItem(key, index, e.target.value)}
                          />
                          {story[key].length > 1 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeArrayItem(key, index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem(key)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={generateChapter}
              disabled={isGenerating || !story.title || !story.characters[0].name}
              className="w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Story...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate First Chapter
                </>
              )}
            </Button>
          </div>

          {/* Generated Chapter Display */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="bg-gray-900/50 border-gray-800 min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Generated Chapter
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedChapter ? (
                  <div className="space-y-6">
                    <div className="prose prose-invert prose-emerald max-w-none">
                      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                          {generatedChapter}
                        </div>
                      </div>
                    </div>
                    
                    {storyId && (
                      <div className="flex gap-3">
                        <Link href={`/stories/${storyId}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Read Full Story
                          </Button>
                        </Link>
                        <Link href={`/stories/${storyId}/continue`} className="flex-1">
                          <Button className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Continue Story
                          </Button>
                        </Link>
                      </div>
                    )}
                    
                    <div className="text-center space-y-4">
                      <Link href="/stories">
                        <Button variant="outline" className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          View All Stories
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline" className="w-full">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Your Story Awaits</h3>
                    <p className="text-gray-400 max-w-sm mb-6">
                      Fill in the story details and click &ldquo;Generate First Chapter&rdquo; to see your narrative come to life.
                    </p>
                    
                    <div className="flex gap-3">
                      <Link href="/stories">
                        <Button variant="outline" size="sm">
                          <BookOpen className="w-4 h-4 mr-2" />
                          View Stories
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline" size="sm">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Home
                        </Button>
                      </Link>
                    </div>
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
          <Link href="/stories">
            <Button 
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
              title="View All Stories"
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

export default function StoryGenerator() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
          <p className="text-gray-400">Loading story generator...</p>
        </div>
      </div>
    }>
      <StoryGeneratorContent />
    </Suspense>
  )
} 