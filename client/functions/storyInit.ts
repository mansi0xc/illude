import { generate } from "./generate";

interface Characters {
    name: string;
    appearance: string;
    personality: string;
    background: string;
    goals: string;
    backstory: string;
    relationships: string;
}

export interface Story {
    title: string;
    description: string;
    characters: Characters[];
    settings: string;
    worldbuilding: string[];
    powerSystem: string[];
    magicSystem: string[];
    technologySystem: string[];
    rules: string[];
    lore: string[];
    history: string[];
    culture: string[];
    plot: string;
    conflict: string;
}

export async function generateFirstChapter(story: Story) {
    const prompt = `
You are a masterful storyteller renowned for captivating first chapters.
Given the following detailed story context:
${JSON.stringify(story, null, 2)}

Your task:
- Write the first chapter of this story.
- Begin with a compelling incident in a specific, vivid setting that triggers the main chain of events.
- Weave in elements of the plot, worldbuilding, and any unique systems (magic, technology, power) as relevant.
- Use a suspenseful, thriller-like tone to immediately hook the reader.
- Reveal the incident in an engaging, immersive way, balancing action, atmosphere, and intrigue.
- Avoid exposition dumps; show rather than tell.

The chapter should be immersive, dynamic, and leave the reader eager for more.
`;
    const chapter = await generate(prompt);
    return chapter;
}