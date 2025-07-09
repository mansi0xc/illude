import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Story, IStory } from "@/lib/models"
import { getServerAuthSession } from "@/lib/auth-utils"

// GET /api/stories - Get user's stories (requires authentication)
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
    
    const stories = await Story.find({ userId: session.user.id })
      .select('title description userId userEmail userName status lastUpdated createdAt chapters')
      .sort({ lastUpdated: -1 })
    
    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}

// POST /api/stories - Create new story
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
    const storyData: Partial<IStory> = body.story
    
    // Initialize memory structure
    const initialMemory = {
      plotPoints: [],
      characterArcs: storyData.characters?.map(char => ({
        characterName: char.name,
        developments: [],
        currentState: char.personality || ''
      })) || [],
      worldState: [],
      importantEvents: [],
      conflicts: storyData.conflict ? [storyData.conflict] : [],
      relationships: [],
      mysteries: [],
      foreshadowing: []
    }
    
    const newStory = new Story({
      ...storyData,
      userId: session.user.id,
      userEmail: session.user.email!,
      userName: session.user.name || '',
      chapters: [],
      memory: initialMemory,
      status: 'draft'
    })
    
    const savedStory = await newStory.save()
    
    return NextResponse.json({ 
      story: savedStory,
      message: 'Story created successfully'
    })
  } catch (error) {
    console.error('Error creating story:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
} 