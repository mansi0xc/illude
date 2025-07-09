import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Story } from "@/lib/models"

// GET /api/community-stories - Get all public stories
export async function GET() {
  try {
    await connectDB()
    
    const stories = await Story.find({})
      .select('title description userId userEmail userName status lastUpdated createdAt chapters')
      .sort({ lastUpdated: -1 })
    
    return NextResponse.json({ stories })
  } catch (error) {
    console.error('Error fetching community stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community stories' },
      { status: 500 }
    )
  }
} 