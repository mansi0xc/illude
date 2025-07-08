import { NextRequest, NextResponse } from "next/server";
import { generateFirstChapter, Story as StoryInput } from "@/functions/storyInit";
import connectDB from "@/lib/mongodb";
import { Story } from "@/lib/models";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        
        const body = await request.json();
        const storyInput: StoryInput = body.story;
        
        // Initialize memory structure
        const initialMemory = {
            plotPoints: [],
            characterArcs: storyInput.characters?.map(char => ({
                characterName: char.name,
                developments: [],
                currentState: char.personality || ''
            })) || [],
            worldState: [],
            importantEvents: [],
            conflicts: storyInput.conflict ? [storyInput.conflict] : [],
            relationships: [],
            mysteries: [],
            foreshadowing: []
        };
        
        // Generate first chapter
        const chapter = await generateFirstChapter(storyInput);
        
        // Create and save story with first chapter
        const newStory = new Story({
            ...storyInput,
            chapters: [{
                chapterNumber: 1,
                content: chapter,
                userDirection: '',
                aiSummary: 'The opening chapter that sets the stage for the story.',
                keyEvents: [],
                charactersInvolved: storyInput.characters?.map(c => c.name) || [],
                newPlotPoints: []
            }],
            memory: initialMemory,
            status: 'active'
        });
        
        const savedStory = await newStory.save();
        
        return NextResponse.json({ 
            chapter,
            story: savedStory,
            storyId: savedStory._id
        });
    } catch (error) {
        console.error('Error creating story:', error);
        return NextResponse.json(
            { error: 'Failed to create story' },
            { status: 500 }
        );
    }
}