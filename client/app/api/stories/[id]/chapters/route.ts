import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Story } from "@/lib/models"
import { generate } from "@/functions/generate"

// POST /api/stories/[id]/chapters - Generate new chapter
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const body = await request.json()
    const { userDirection = '', generateType = 'ai' } = body // 'ai' or 'user-directed'
    
    const story = await Story.findById(id)
    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }
    
    const nextChapterNumber = story.chapters.length + 1
    
    // Build context for AI generation
    const storyContext = {
      title: story.title,
      description: story.description,
      characters: story.characters,
      settings: story.settings,
      worldbuilding: story.worldbuilding,
      powerSystem: story.powerSystem,
      magicSystem: story.magicSystem,
      technologySystem: story.technologySystem,
      rules: story.rules,
      lore: story.lore,
      history: story.history,
      culture: story.culture,
      plot: story.plot,
      conflict: story.conflict,
      memory: story.memory
    }
    
    // Create memory context string
    const memoryContext = `
STORY MEMORY AND CONTINUITY:
- Plot Points: ${story.memory.plotPoints.join(', ')}
- Active Conflicts: ${story.memory.conflicts.join(', ')}
- Important Events: ${story.memory.importantEvents.join(', ')}
- World State: ${story.memory.worldState.join(', ')}
- Mysteries to Resolve: ${story.memory.mysteries.join(', ')}
- Foreshadowing Elements: ${story.memory.foreshadowing.join(', ')}

CHARACTER ARCS:
${story.memory.characterArcs.map(arc => 
  `${arc.characterName}: Current State - ${arc.currentState}, Developments - ${arc.developments.join(', ')}`
).join('\n')}

PREVIOUS CHAPTERS SUMMARY:
${story.chapters.map(chapter => 
  `Chapter ${chapter.chapterNumber}: ${chapter.aiSummary || 'Key events: ' + chapter.keyEvents?.join(', ')}`
).join('\n')}
    `
    
    // Generate chapter based on type
    let prompt = ''
    
    if (generateType === 'user-directed' && userDirection) {
      prompt = `
You are continuing a story. This is Chapter ${nextChapterNumber}.

${memoryContext}

STORY CONTEXT:
${JSON.stringify(storyContext, null, 2)}

USER DIRECTION: ${userDirection}

Your task:
- Write Chapter ${nextChapterNumber} following the user's direction: "${userDirection}"
- Maintain consistency with previous chapters and story memory
- Develop character arcs naturally
- Advance the plot meaningfully
- Keep the tone and style consistent
- Ensure new developments align with established world rules
- Create engaging, immersive prose
- End with a natural transition point

Remember to:
- Reference previous events when relevant
- Show character growth based on their arcs
- Maintain world consistency
- Advance ongoing conflicts or introduce new ones appropriately
- Pay off any foreshadowing when appropriate
`
    } else {
      prompt = `
You are continuing a story. This is Chapter ${nextChapterNumber}.

${memoryContext}

STORY CONTEXT:
${JSON.stringify(storyContext, null, 2)}

Your task:
- Write Chapter ${nextChapterNumber} that naturally progresses the story
- Decide on the best direction for the plot based on established elements
- Maintain consistency with previous chapters and story memory
- Develop character arcs naturally
- Advance existing conflicts or introduce new meaningful developments
- Keep the tone and style consistent
- Create engaging, immersive prose
- End with a natural transition point or cliffhanger

Remember to:
- Build on established plot points and character developments
- Reference previous events when relevant
- Show character growth based on their arcs
- Maintain world consistency
- Pay off foreshadowing when appropriate
- Create meaningful story progression
`
    }
    
    // Generate the chapter
    const chapterContent = await generate(prompt)
    
    // Generate AI summary and extract key information
    const analysisPrompt = `
Analyze this chapter and extract key information for story continuity:

CHAPTER CONTENT:
${chapterContent}

Please provide a JSON response with:
{
  "summary": "Brief summary of what happened in this chapter",
  "keyEvents": ["event1", "event2", "event3"],
  "charactersInvolved": ["character1", "character2"],
  "newPlotPoints": ["plot point 1", "plot point 2"],
  "characterDevelopments": [
    {"character": "name", "development": "what changed or happened to them"}
  ],
  "worldStateChanges": ["change1", "change2"],
  "newConflicts": ["conflict1", "conflict2"],
  "resolvedConflicts": ["resolved1", "resolved2"],
  "mysteries": ["new mystery 1", "new mystery 2"],
  "foreshadowing": ["element1", "element2"]
}
`
    
    const analysisResponse = await generate(analysisPrompt)
    let analysisData
    
    try {
      // Extract JSON from the response
      const jsonMatch = analysisResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (error) {
      console.error('Error parsing analysis:', error)
      // Fallback analysis
      analysisData = {
        summary: `Chapter ${nextChapterNumber} continues the story`,
        keyEvents: [],
        charactersInvolved: story.characters.map(c => c.name),
        newPlotPoints: [],
        characterDevelopments: [],
        worldStateChanges: [],
        newConflicts: [],
        resolvedConflicts: [],
        mysteries: [],
        foreshadowing: []
      }
    }
    
    // Create new chapter
    const newChapter = {
      chapterNumber: nextChapterNumber,
      content: chapterContent,
      userDirection: userDirection,
      aiSummary: analysisData.summary,
      keyEvents: analysisData.keyEvents || [],
      charactersInvolved: analysisData.charactersInvolved || [],
      newPlotPoints: analysisData.newPlotPoints || []
    }
    
    // Update story memory
    const updatedMemory = {
      plotPoints: [
        ...story.memory.plotPoints,
        ...(analysisData.newPlotPoints || [])
      ],
      characterArcs: story.memory.characterArcs.map(arc => {
        const development = analysisData.characterDevelopments?.find(
          (dev: any) => dev.character === arc.characterName
        )
        if (development) {
          return {
            ...arc,
            developments: [...arc.developments, development.development],
            currentState: development.development
          }
        }
        return arc
      }),
      worldState: [
        ...story.memory.worldState,
        ...(analysisData.worldStateChanges || [])
      ],
      importantEvents: [
        ...story.memory.importantEvents,
        ...(analysisData.keyEvents || [])
      ],
      conflicts: [
        ...story.memory.conflicts.filter(c => 
          !analysisData.resolvedConflicts?.includes(c)
        ),
        ...(analysisData.newConflicts || [])
      ],
      relationships: story.memory.relationships,
      mysteries: [
        ...story.memory.mysteries,
        ...(analysisData.mysteries || [])
      ],
      foreshadowing: [
        ...story.memory.foreshadowing,
        ...(analysisData.foreshadowing || [])
      ]
    }
    
    // Update story with new chapter and memory
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      {
        $push: { chapters: newChapter },
        $set: { 
          memory: updatedMemory,
          status: 'active'
        }
      },
      { new: true }
    )
    
    return NextResponse.json({
      chapter: newChapter,
      story: updatedStory,
      message: 'Chapter generated successfully'
    })
    
  } catch (error) {
    console.error('Error generating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapter' },
      { status: 500 }
    )
  }
} 