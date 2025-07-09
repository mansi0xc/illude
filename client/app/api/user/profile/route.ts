import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { User, Story } from "@/lib/models"
import { getServerAuthSession } from "@/lib/auth-utils"

// GET /api/user/profile - Get user profile
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
      await user.save()
    }

    // Update the user's created stories list
    const createdStories = await Story.find({ userId: session.user.id }).select('_id')
    user.createdStories = createdStories.map(story => story._id.toString())
    
    await user.save()

    return NextResponse.json({ 
      user: {
        ...user.toObject(),
        createdStories: user.createdStories
      }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
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
    const { name, username, profilePhoto } = body

    // Find user
    const user = await User.findOne({ id: session.user.id })
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if username is already taken (if provided)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, id: { $ne: session.user.id } })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Update user fields
    if (name !== undefined) user.name = name
    if (username !== undefined) user.username = username
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto

    await user.save()

    return NextResponse.json({ 
      user: user.toObject(),
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
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
  
  return `avatar-${colorIndex}-${initials}`
} 