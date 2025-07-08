import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, BookOpen, Users, ArrowRight, Play, Star } from "lucide-react"
import RotatingCards from "@/components/ui/rotating-cards"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
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
              <a href="/stories" className="text-gray-300 hover:text-emerald-400 transition-colors">
                My Stories
              </a>
              <a href="/story-generator">
                <Button
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
                >
                  Create Story
                </Button>
              </a>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <a href="/story-generator">
                <Button
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                >
                  Create
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Storytelling
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Bring Your
              <span className="block text-emerald-400">Imagination</span>
              to Life
            </h1>
            
            {/* 3D Rotating Cards */}
            <div className="my-12">
              <RotatingCards />
            </div>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Illude is an AI-powered interactive story generator that crafts evolving narratives in real-time. You're
              the creative director, and AI is your loyal scribe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/story-generator">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg shadow-emerald-500/25"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-xl bg-transparent"
              >
                Watch Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
            <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Generation</h3>
                <p className="text-gray-400 leading-relaxed">
                  Watch your story unfold instantly as the AI crafts compelling narratives based on your prompts and
                  directions.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Character Development</h3>
                <p className="text-gray-400 leading-relaxed">
                  Create rich, complex characters that evolve throughout your story with consistent personalities and
                  motivations.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive Control</h3>
                <p className="text-gray-400 leading-relaxed">
                  Guide the narrative direction with your creative input while the AI handles the intricate storytelling
                  details.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Navigation */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8 text-emerald-400">Quick Start</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a href="/story-generator" className="block">
                <Card className="bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-500/30 transition-colors">
                      <Play className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-emerald-400 transition-colors">Create New Story</h4>
                    <p className="text-gray-400 text-sm">Start crafting your epic narrative</p>
                  </CardContent>
                </Card>
              </a>
              
              <a href="/stories" className="block">
                <Card className="bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-500/30 transition-colors">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">View My Stories</h4>
                    <p className="text-gray-400 text-sm">Continue your existing adventures</p>
                  </CardContent>
                </Card>
              </a>
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
                Direct the story's progression with your creative input while AI generates compelling plot developments.
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
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-emerald-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "Illude has revolutionized my creative process. The AI understands my vision and helps bring stories
                  to life in ways I never imagined."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-semibold mr-3">
                    S
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-gray-400 text-sm">Fantasy Author</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-emerald-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "The interactive storytelling experience is incredible. It's like having a co-writer who never runs
                  out of creative ideas."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-semibold mr-3">
                    M
                  </div>
                  <div>
                    <p className="font-semibold">Marcus Rodriguez</p>
                    <p className="text-gray-400 text-sm">Screenwriter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Create Your Story?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already bringing their imagination to life with Illude.
          </p>
          <a href="/story-generator">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-12 py-4 rounded-xl shadow-lg shadow-emerald-500/25"
            >
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
