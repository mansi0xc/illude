"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, BookOpen, Users, Play, Star, LogIn, LogOut, User, ChevronDown } from "lucide-react"
import RotatingCards from "@/components/ui/rotating-cards"
import { CyberCard } from "@/components/ui/cyber-card"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

export default function HomePage() {
  const { data: session } = useSession()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-[9999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Illude</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-emerald-400 transition-colors">
                How it Works
              </a>
              <Link href="/community-works" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Community Works
              </Link>
              {session && (
                <Link href="/stories" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  My Stories
                </Link>
              )}
              {session ? (
                <div className="flex items-center space-x-4">
                  <a href="/story-generator">
                    <Button variant="outline">
                      Create Story
                    </Button>
                  </a>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors focus:outline-none"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">{session.user?.name || 'Profile'}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <Link 
                            href="/profile" 
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-colors"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              setShowUserDropdown(false)
                              signOut()
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => signIn('google')}
                  variant="outline"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {session ? (
                <>
                  <a href="/story-generator">
                    <Button size="sm">
                      Create
                    </Button>
                  </a>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center space-x-1 text-gray-300 hover:text-emerald-400 transition-colors focus:outline-none p-1"
                    >
                      <User className="w-4 h-4" />
                      <ChevronDown className={`w-3 h-3 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <Link 
                            href="/profile" 
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-colors"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              setShowUserDropdown(false)
                              signOut()
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => signIn('google')}
                  size="sm"
                  variant="outline"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-purple-500/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-500/3 to-pink-500/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 text-emerald-400 border-emerald-500/20 hover:bg-gradient-to-r hover:from-emerald-500/20 hover:via-cyan-500/20 hover:to-purple-500/20">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Storytelling
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 via-emerald-200 to-purple-200 bg-clip-text text-transparent">
              Bring Your
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Imagination</span>
              to Life
            </h1>
            
            {/* 3D Rotating Cards */}
            <div className="my-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-yellow-500/10 to-pink-500/10 rounded-full blur-3xl transform scale-150"></div>
              <div className="relative z-10">
                <RotatingCards />
              </div>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Illude is an AI-powered interactive story generator that crafts evolving narratives in real-time. You&apos;re
              the creative director, and AI is your loyal scribe.
            </p>
            <div className="flex justify-center">
              <a href="/story-generator">
                <Button size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-transparent to-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to create compelling, interactive stories with the power of AI
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <CyberCard 
              variant="feature"
              title="AI POWER"
              subtitle="NEXT-GEN STORYTELLING"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Real-time Generation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Watch your story unfold instantly as the AI crafts compelling narratives based on your prompts and
                    directions.
                  </p>
                </CardContent>
              </Card>
            </CyberCard>
            
            <CyberCard 
              variant="character"
              title="CHARACTERS"
              subtitle="DYNAMIC PERSONALITIES"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                    <Users className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Character Development</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Create rich, complex characters that evolve throughout your story with consistent personalities and
                    motivations.
                  </p>
                </CardContent>
              </Card>
            </CyberCard>
            
            <CyberCard 
              variant="feature"
              title="CONTROL"
              subtitle="INTERACTIVE EXPERIENCE"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Interactive Control</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Guide the narrative direction with your creative input while the AI handles the intricate storytelling
                    details.
                  </p>
                </CardContent>
              </Card>
            </CyberCard>
          </div>
          
          {/* Quick Navigation */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Quick Start</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a href="/story-generator" className="block">
                <CyberCard 
                  variant="feature"
                  title="CREATE"
                  subtitle="NEW ADVENTURE"
                >
                  <Card className="bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-500/30 transition-colors">
                        <Play className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-emerald-100 group-hover:text-emerald-300 transition-colors">Create New Story</h4>
                      <p className="text-emerald-300/80 text-sm">Start crafting your epic narrative</p>
                    </CardContent>
                  </Card>
                </CyberCard>
              </a>
              
              <Link href="/stories" className="block">
                <CyberCard 
                  variant="story"
                  title="STORIES"
                  subtitle="YOUR COLLECTION"
                >
                  <Card className="bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-500/30 transition-colors">
                        <BookOpen className="w-6 h-6 text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-blue-100 group-hover:text-blue-300 transition-colors">View My Stories</h4>
                      <p className="text-blue-300/80 text-sm">Continue your existing adventures</p>
                    </CardContent>
                  </Card>
                </CyberCard>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple steps to create extraordinary stories</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Your Scene</h3>
              <p className="text-gray-400">
                Provide a prompt, setting, and introduce your characters to establish the foundation of your story.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Guide the Narrative</h3>
              <p className="text-gray-400">
                Direct the story&apos;s progression with your creative input while AI generates compelling plot developments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-black font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Watch It Evolve</h3>
              <p className="text-gray-400">
                Experience your story come to life as it adapts and grows based on your creative decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Creators Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <CyberCard 
              variant="testimonial"
              title="REVIEW"
              subtitle="5 STAR RATING"
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-emerald-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">
                    &ldquo;Illude has revolutionized my creative process. The AI understands my vision and helps bring stories
                    to life in ways I never imagined.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-semibold mr-3">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-white">Sarah Chen</p>
                      <p className="text-gray-300 text-sm">Fantasy Author</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CyberCard>
            
            <CyberCard 
              variant="testimonial"
              title="REVIEW"
              subtitle="5 STAR RATING"
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-emerald-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">
                    &ldquo;The interactive storytelling experience is incredible. It&apos;s like having a co-writer who never runs
                    out of creative ideas.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-semibold mr-3">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-white">Marcus Rodriguez</p>
                      <p className="text-gray-300 text-sm">Screenwriter</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CyberCard>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-purple-500/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Story?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already bringing their imagination to life with Illude.
          </p>
          <a href="/story-generator">
            <Button size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">Illude</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Illude. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
