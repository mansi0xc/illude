import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Story } from "@/lib/models"

// GET /api/stories/[id] - Get single story
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const story = await Story.findById(id)
    
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}

// PUT /api/stories/[id] - Update story
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const body = await request.json()
    const updateData = body.story
    
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    
    if (!updatedStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      story: updatedStory,
      message: 'Story updated successfully'
    })
  } catch (error) {
    console.error('Error updating story:', error)
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    )
  }
}

// DELETE /api/stories/[id] - Delete story
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const deletedStory = await Story.findByIdAndDelete(id)
    
    if (!deletedStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      message: 'Story deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting story:', error)
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    )
  }
} 