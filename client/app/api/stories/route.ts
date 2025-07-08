import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Story, IStory } from "@/lib/models"

// GET /api/stories - Get all stories
export async function GET() {
  try {
    await connectDB()
    
    const stories = await Story.find({})
      .select('title description status lastUpdated createdAt chapters')
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