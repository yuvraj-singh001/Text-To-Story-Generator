export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  genre: string;
  tone: string;
  audience: string;
  artStyle: string;
  scenes: StoryScene[];
  createdAt: Date;
}

export interface StoryScene {
  id: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  imagePrompt: string;
  order: number;
}

export interface StoryRequest {
  prompt: string;
  genre: string;
  tone: string;
  audience: string;
  artStyle: string;
}