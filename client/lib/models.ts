import mongoose from 'mongoose'

// Character Schema
const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  appearance: { type: String, default: '' },
  personality: { type: String, default: '' },
  background: { type: String, default: '' },
  goals: { type: String, default: '' },
  backstory: { type: String, default: '' },
  relationships: { type: String, default: '' },
  currentState: { type: String, default: '' }, // Track character development
  arcs: [{ type: String }], // Character arc progression
})

// Story Memory Schema - for maintaining consistency
const StoryMemorySchema = new mongoose.Schema({
  plotPoints: [{ type: String }], // Key plot developments
  characterArcs: [{
    characterName: { type: String, required: true },
    developments: [{ type: String }],
    currentState: { type: String, default: '' }
  }],
  worldState: [{ type: String }], // Current state of the world
  importantEvents: [{ type: String }], // Key events that happened
  conflicts: [{ type: String }], // Active conflicts
  relationships: [{ type: String }], // Current relationships between characters
  mysteries: [{ type: String }], // Unresolved mysteries
  foreshadowing: [{ type: String }], // Elements to pay off later
})

// Chapter Schema
const ChapterSchema = new mongoose.Schema({
  chapterNumber: { type: Number, required: true },
  title: { type: String, default: '' },
  content: { type: String, required: true },
  userDirection: { type: String, default: '' }, // User's direction for this chapter
  aiSummary: { type: String, default: '' }, // AI's summary of what happened
  keyEvents: [{ type: String }], // Important events in this chapter
  charactersInvolved: [{ type: String }], // Characters that appeared
  newPlotPoints: [{ type: String }], // New plot developments
  createdAt: { type: Date, default: Date.now },
})

// Main Story Schema
const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  characters: [CharacterSchema],
  settings: { type: String, default: '' },
  worldbuilding: [{ type: String }],
  powerSystem: [{ type: String }],
  magicSystem: [{ type: String }],
  technologySystem: [{ type: String }],
  rules: [{ type: String }],
  lore: [{ type: String }],
  history: [{ type: String }],
  culture: [{ type: String }],
  plot: { type: String, default: '' },
  conflict: { type: String, default: '' },
  chapters: [ChapterSchema],
  memory: StoryMemorySchema,
  status: { 
    type: String, 
    enum: ['draft', 'active', 'completed', 'paused'], 
    default: 'draft' 
  },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
})

// Update lastUpdated on save
StorySchema.pre('save', function(next) {
  this.lastUpdated = new Date()
  next()
})

// Export models
export const Story = mongoose.models.Story || mongoose.model('Story', StorySchema)
export const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema)

// Types for TypeScript
export interface ICharacter {
  name: string
  appearance?: string
  personality?: string
  background?: string
  goals?: string
  backstory?: string
  relationships?: string
  currentState?: string
  arcs?: string[]
}

export interface IStoryMemory {
  plotPoints: string[]
  characterArcs: {
    characterName: string
    developments: string[]
    currentState: string
  }[]
  worldState: string[]
  importantEvents: string[]
  conflicts: string[]
  relationships: string[]
  mysteries: string[]
  foreshadowing: string[]
}

export interface IChapter {
  chapterNumber: number
  title?: string
  content: string
  userDirection?: string
  aiSummary?: string
  keyEvents?: string[]
  charactersInvolved?: string[]
  newPlotPoints?: string[]
  createdAt?: Date
}

export interface IStory {
  _id?: string
  title: string
  description?: string
  characters: ICharacter[]
  settings?: string
  worldbuilding?: string[]
  powerSystem?: string[]
  magicSystem?: string[]
  technologySystem?: string[]
  rules?: string[]
  lore?: string[]
  history?: string[]
  culture?: string[]
  plot?: string
  conflict?: string
  chapters: IChapter[]
  memory: IStoryMemory
  status?: 'draft' | 'active' | 'completed' | 'paused'
  lastUpdated?: Date
  createdAt?: Date
} 