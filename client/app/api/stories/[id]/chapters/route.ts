import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Story, ICharacter } from "@/lib/models"
import { generate } from "@/functions/generate"

interface CharacterArc {
  characterName: string;
  developments: string[];
  currentState: string;
}

interface Chapter {
  chapterNumber: number;
  title: string;
  content: string;
  userDirection: string;
  aiSummary: string;
  keyEvents: string[];
  charactersInvolved: string[];
}

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
    
    // Analyze the previous chapter's ending for continuity
    let previousChapterAnalysis = null
    let lastChapterContent = ''
    
    if (story.chapters.length > 0) {
      const lastChapter = story.chapters[story.chapters.length - 1]
      lastChapterContent = lastChapter.content
      
      // Analyze the ending of the previous chapter
      const endingAnalysisPrompt = `
Analyze the ending of this chapter to determine how the next chapter should begin:

CHAPTER CONTENT:
${lastChapterContent}

Please provide a JSON response with:
{
  "endingType": "cliffhanger" | "natural_conclusion" | "scene_transition" | "action_sequence" | "dialogue_pause" | "emotional_moment",
  "lastScene": "Brief description of the final scene/moment",
  "activeElements": ["ongoing actions", "unresolved tensions", "immediate situations"],
  "continuityNeeds": "immediate_continuation" | "scene_break" | "time_skip_allowed" | "location_change",
  "tonalState": "tense" | "calm" | "emotional" | "action-packed" | "mysterious" | "romantic" | "dramatic",
  "immediateQuestions": ["What happens next?", "How will character react?"],
  "suggestedOpening": "Brief suggestion for how next chapter should open"
}
`
      
      try {
        const endingAnalysis = await generate(endingAnalysisPrompt)
        const jsonMatch = endingAnalysis.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          previousChapterAnalysis = JSON.parse(jsonMatch[0])
        }
      } catch (error) {
        console.error('Error analyzing previous chapter ending:', error)
        // Fallback analysis
        previousChapterAnalysis = {
          endingType: "natural_conclusion",
          continuityNeeds: "scene_break",
          tonalState: "neutral",
          suggestedOpening: "Continue the story naturally"
        }
      }
    }
    
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
    
    // Create enhanced memory context string with continuity analysis
    const memoryContext = `
STORY MEMORY AND CONTINUITY:
- Plot Points: ${story.memory.plotPoints.join(', ')}
- Active Conflicts: ${story.memory.conflicts.join(', ')}
- Important Events: ${story.memory.importantEvents.join(', ')}
- World State: ${story.memory.worldState.join(', ')}
- Mysteries to Resolve: ${story.memory.mysteries.join(', ')}
- Foreshadowing Elements: ${story.memory.foreshadowing.join(', ')}

CHARACTER ARCS:
${story.memory.characterArcs.map((arc: CharacterArc) => 
  `${arc.characterName}: Current State - ${arc.currentState}, Developments - ${arc.developments.join(', ')}`
).join('\n')}

PREVIOUS CHAPTERS SUMMARY:
${story.chapters.map((chapter: Chapter) => 
  `Chapter ${chapter.chapterNumber}: ${chapter.aiSummary || 'Key events: ' + chapter.keyEvents?.join(', ')}`
).join('\n')}

${previousChapterAnalysis ? `
PREVIOUS CHAPTER ENDING ANALYSIS:
- Ending Type: ${previousChapterAnalysis.endingType}
- Last Scene: ${previousChapterAnalysis.lastScene || 'Not specified'}
- Active Elements: ${previousChapterAnalysis.activeElements?.join(', ') || 'None'}
- Continuity Needs: ${previousChapterAnalysis.continuityNeeds}
- Tonal State: ${previousChapterAnalysis.tonalState}
- Immediate Questions: ${previousChapterAnalysis.immediateQuestions?.join(', ') || 'None'}
- Suggested Opening: ${previousChapterAnalysis.suggestedOpening}

${lastChapterContent ? `
LAST CHAPTER'S FINAL PARAGRAPHS (for direct reference):
${lastChapterContent.split('\n').slice(-5).join('\n')}
` : ''}
` : 'This is the first chapter.'}
    `
    
    // Generate continuity instructions based on analysis
    let continuityInstructions = ''
    if (previousChapterAnalysis) {
      switch (previousChapterAnalysis.continuityNeeds) {
        case 'immediate_continuation':
          continuityInstructions = `
CRITICAL CONTINUITY REQUIREMENTS:
- Begin IMMEDIATELY where the previous chapter ended
- Pick up the exact scene, moment, or action that was left unresolved
- Maintain the same characters, location, and immediate situation
- Address the immediate questions or tensions from the cliffhanger
- Keep the same tonal energy and pacing
- DO NOT skip time or change locations unless absolutely necessary for the immediate action
`
          break
        case 'scene_break':
          continuityInstructions = `
CONTINUITY REQUIREMENTS:
- You may begin with a brief scene break or transition
- Address the consequences or follow-up to the previous chapter's ending
- Maintain logical story flow while allowing for natural pacing
- Keep character states and story momentum consistent
`
          break
        case 'time_skip_allowed':
          continuityInstructions = `
CONTINUITY REQUIREMENTS:
- A time skip is acceptable but should be logical and purposeful
- Reference or show consequences of previous chapter's events
- Maintain character development and story arc progression
- Ensure any time gap feels natural to the story
`
          break
        case 'location_change':
          continuityInstructions = `
CONTINUITY REQUIREMENTS:
- Location change is acceptable but maintain story and character continuity
- Show logical connection to previous chapter's events
- Keep character states and emotional momentum consistent
- Ensure the transition feels natural and purposeful
`
          break
      }
    }
    
    // Generate chapter based on type
    let prompt = ''
    
    if (generateType === 'user-directed' && userDirection) {
      prompt = `
You are continuing a story. This is Chapter ${nextChapterNumber}.

${memoryContext}

${continuityInstructions}

STORY CONTEXT:
${JSON.stringify(storyContext, null, 2)}

USER DIRECTION: ${userDirection}

Your task:
- Write Chapter ${nextChapterNumber} following the user's direction: "${userDirection}"
- At the very beginning of the chapter, start with "## Chapter ${nextChapterNumber}: <appropriate chapter title>"
- MAINTAIN STRICT CONTINUITY with the previous chapter's ending
- Develop character arcs naturally
- Advance the plot meaningfully
- Keep the tone and style consistent
- Ensure new developments align with established world rules
- Create engaging, immersive prose
- End with a natural transition point

Remember to:
- ${previousChapterAnalysis?.continuityNeeds === 'immediate_continuation' ? 
    'Continue DIRECTLY from where the previous chapter left off' : 
    'Maintain logical story flow and address previous chapter\'s consequences'}
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

${continuityInstructions}

STORY CONTEXT:
${JSON.stringify(storyContext, null, 2)}

Your task:
- Write Chapter ${nextChapterNumber} that naturally progresses the story
- At the very beginning of the chapter, start with "## Chapter ${nextChapterNumber}: <appropriate chapter title>"
- MAINTAIN STRICT CONTINUITY with the previous chapter's ending
- Decide on the best direction for the plot based on established elements
- Develop character arcs naturally
- Advance existing conflicts or introduce new meaningful developments
- Keep the tone and style consistent
- Create engaging, immersive prose
- End with a natural transition point or cliffhanger

Remember to:
- ${previousChapterAnalysis?.continuityNeeds === 'immediate_continuation' ? 
    'Continue DIRECTLY from where the previous chapter left off' : 
    'Maintain logical story flow and address previous chapter\'s consequences'}
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
        charactersInvolved: story.characters.map((c: ICharacter) => c.name),
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
      characterArcs: story.memory.characterArcs.map((arc: CharacterArc) => {
        const development = analysisData.characterDevelopments?.find(
          (dev: { character: string; development: string }) => dev.character === arc.characterName
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
        ...story.memory.conflicts.filter((c: string) => 
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