export interface NatureWalkPrompt {
  id: string;
  prompt: string;
}

export const natureWalkPrompts: NatureWalkPrompt[] = [
  { id: 'nw-1', prompt: 'Find something that is older than you.' },
  { id: 'nw-2', prompt: 'Listen for three different sounds.' },
  { id: 'nw-3', prompt: 'Find evidence of an animal.' },
  { id: 'nw-4', prompt: 'Find something changing with the season.' },
  { id: 'nw-5', prompt: 'Notice a smell you would not notice indoors.' },
  { id: 'nw-6', prompt: 'Find a plant growing somewhere unexpected.' },
  { id: 'nw-7', prompt: 'Look for a pattern repeated in nature nearby.' },
  { id: 'nw-8', prompt: 'Find a spot where water has shaped the land.' },
];

export const walkDurations = [10, 20, 30] as const;
