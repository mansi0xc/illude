import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User, Story } from "@/lib/models"
import { getServerAuthSession } from "@/lib/auth-utils"

// POST /api/user/bookmarks - Add or remove bookmark
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const session = await getServerAuthSession()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { storyId, action } = body // action: 'add' or 'remove'

    if (!storyId || !action) {
      return NextResponse.json(
        { error: 'Missing storyId or action' },
        { status: 400 }
      )
    }

    // Check if story exists
    const story = await Story.findById(storyId)
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Find or create user
    let user = await User.findOne({ id: session.user.id })
    if (!user) {
      // Create user if doesn't exist
      user = new User({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name || '',
        profilePhoto: await generateDefaultAvatar(session.user.name || session.user.email!),
        bookmarks: [],
        createdStories: []
      })
    }

    // Add or remove bookmark
    if (action === 'add') {
      if (!user.bookmarks.includes(storyId)) {
        user.bookmarks.push(storyId)
      }
    } else if (action === 'remove') {
      user.bookmarks = user.bookmarks.filter((id: string | object) => id.toString() !== storyId)
    }

    await user.save()

    return NextResponse.json({ 
      success: true,
      bookmarked: action === 'add',
      bookmarkCount: user.bookmarks.length
    })
  } catch (error) {
    console.error('Error managing bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to manage bookmark' },
      { status: 500 }
    )
  }
}

// GET /api/user/bookmarks - Get user's bookmarks
export async function GET() {
  try {
    await connectDB()
    
    const session = await getServerAuthSession()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await User.findOne({ id: session.user.id })
    if (!user) {
      return NextResponse.json({ bookmarks: [] })
    }

    // Get bookmarked stories with details
    const bookmarkedStories = await Story.find({
      _id: { $in: user.bookmarks }
    }).select('title description userId userEmail userName status lastUpdated createdAt chapters')
      .sort({ lastUpdated: -1 })

    return NextResponse.json({ 
      bookmarks: user.bookmarks,
      bookmarkedStories 
    })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

// Generate a default avatar using a color-based system
async function generateDefaultAvatar(name: string): Promise<string> {
  const colors = [
    'bg-gradient-to-br from-emerald-400 to-emerald-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-cyan-400 to-cyan-600'
  ]
  
  // Use name hash to determine color
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colorIndex = Math.abs(hash) % colors.length
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  
  // Return a data URL or a reference to generate the avatar client-side
  return `avatar-${colorIndex}-${initials}`
} 