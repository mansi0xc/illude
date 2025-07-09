"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Eye, ArrowLeft, Calendar, Edit, Save, X, User, Library, Bookmark, Pen, Camera } from "lucide-react"
import Link from "next/link"
import { useSession, signIn } from "next-auth/react"

interface UserProfile {
  _id: string
  id: string
  email: string
  name: string
  username: string
  profilePhoto: string
  joinedAt: string
  bookmarks: string[]
  createdStories: string[]
  lastActive: string
}

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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [bookmarkedStories, setBookmarkedStories] = useState<StoryPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedUsername, setEditedUsername] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }
    if (session) {
      fetchProfile()
    }
  }, [session, status])

  const fetchProfile = async () => {
    try {
      const [profileResponse, bookmarksResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/bookmarks')
      ])
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData.user)
        setEditedName(profileData.user.name || '')
        setEditedUsername(profileData.user.username || '')
      }
      
      if (bookmarksResponse.ok) {
        const bookmarksData = await bookmarksResponse.json()
        setBookmarkedStories(bookmarksData.bookmarkedStories || [])
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!profile) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          username: editedUsername
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setEditingProfile(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
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

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const getAuthorDisplay = (story: StoryPreview) => {
    if (story.userName) return story.userName
    if (story.userEmail) return story.userEmail.split('@')[0]
    return 'Anonymous'
  }

  const generateAvatarFromString = (avatarString: string, name: string) => {
    if (!avatarString.startsWith('avatar-')) {
      return avatarString // Return as-is if it's a URL
    }
    
    const [, colorIndex, initials] = avatarString.split('-')
    const colors = [
      'from-emerald-400 to-emerald-600',
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
      'from-indigo-400 to-indigo-600',
      'from-cyan-400 to-cyan-600'
    ]
    
    const colorClass = colors[parseInt(colorIndex)] || colors[0]
    const displayInitials = initials || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    
    return (
      <div className={`w-24 h-24 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-black font-bold text-2xl`}>
        {displayInitials}
      </div>
    )
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
          <p className="text-gray-400">Loading your profile...</p>
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
              <User className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Sign In Required</h3>
            <p className="text-gray-400 mb-8">
              Please sign in to view your profile and manage your stories.
            </p>
            <Button 
              onClick={() => signIn('google')}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <User className="w-5 h-5 mr-2" />
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
      <nav className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-[9999]">
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
              <User className="w-3 h-3 mr-1" />
              My Profile
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Photo */}
                <div className="flex flex-col items-center gap-4">
                  {profile?.profilePhoto ? (
                    generateAvatarFromString(profile.profilePhoto, profile.name || profile.email)
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-black font-bold text-2xl">
                      {(profile?.name || profile?.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-gray-500 text-center">Photo editing coming soon</p>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      {editingProfile ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors"
                              placeholder="Enter your display name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                              type="text"
                              value={editedUsername}
                              onChange={(e) => setEditedUsername(e.target.value)}
                              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors"
                              placeholder="Choose a username"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                            {profile?.name || 'Anonymous User'}
                          </h1>
                          {profile?.username && (
                            <p className="text-emerald-400 text-lg mb-2">@{profile.username}</p>
                          )}
                          <p className="text-gray-400 mb-4">{profile?.email}</p>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {editingProfile ? (
                        <>
                          <Button
                            onClick={saveProfile}
                            disabled={saving}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            {saving ? (
                              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingProfile(false)
                              setEditedName(profile?.name || '')
                              setEditedUsername(profile?.username || '')
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setEditingProfile(true)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-400">{profile?.createdStories?.length || 0}</div>
                      <div className="text-sm text-gray-400">Stories Created</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{profile?.bookmarks?.length || 0}</div>
                      <div className="text-sm text-gray-400">Bookmarked</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {profile?.joinedAt ? formatJoinDate(profile.joinedAt) : 'Recently'}
                      </div>
                      <div className="text-sm text-gray-400">Member Since</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-400">Active</div>
                      <div className="text-sm text-gray-400">Status</div>
                    </div>
                  </div>

                  {profile?.joinedAt && (
                    <div className="mt-6 flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatJoinDate(profile.joinedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookmarked Library */}
        <div className="mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="w-5 h-5 text-emerald-400" />
                My Library
                <Badge variant="secondary" className="ml-2">
                  {bookmarkedStories.length} bookmarked
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookmarkedStories.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Bookmarked Stories</h3>
                  <p className="text-gray-400 mb-6">
                    Discover amazing stories and bookmark them to build your personal library.
                  </p>
                  <Link href="/community-works">
                    <Button>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Explore Community Works
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedStories.map((story) => (
                    <Card key={story._id} className="bg-gray-800/30 border-gray-700 hover:border-emerald-500/30 transition-all duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={getStatusColor(story.status)}>
                            {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                          </Badge>
                          <Bookmark className="w-4 h-4 text-emerald-400" />
                        </div>
                        <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                          {story.title}
                        </CardTitle>
                        <p className="text-xs text-gray-500">by {getAuthorDisplay(story)}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                          {story.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{story.chapters.length} chapters</span>
                          <span>•</span>
                          <span>{formatDate(story.lastUpdated)}</span>
                        </div>

                        <Link href={`/stories/${story._id}`} className="block">
                          <Button size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Read Story
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/stories">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <Pen className="w-12 h-12 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">My Stories</h3>
                <p className="text-gray-400 text-sm">Manage and continue your created stories</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community-works">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">Community Works</h3>
                <p className="text-gray-400 text-sm">Discover stories from other creators</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/story-generator">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/30 transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">Create New Story</h3>
                <p className="text-gray-400 text-sm">Start a new creative adventure</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
} 