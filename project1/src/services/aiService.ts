import OpenAI from 'openai';
import axios from 'axios';


// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface StoryScene {
  id: string;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  audioUrl?: string;
  order: number;
}

export interface StoryGenerationRequest {
  prompt: string;
  genre: string;
  tone: string;
  audience: string;
  artStyle: string;
}

export class AIService {
  // Generate story text using OpenAI GPT-4
  static async generateStoryText(request: StoryGenerationRequest): Promise<string[]> {
    try {
      const systemPrompt = `You are a creative storyteller. Create a ${request.audience}-appropriate ${request.genre} story with a ${request.tone} tone. 
      Break the story into exactly 5 scenes. Each scene should be 2-3 sentences long and suitable for illustration.
      Return only the scenes separated by "|||" with no additional formatting or numbering.`;

      const response = await openai.chat.completions.create({
        model: "gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Story idea: ${request.prompt}` }
        ],
        max_tokens: 1000,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split('|||').map(scene => scene.trim()).filter(scene => scene.length > 0);
    } catch (error) {
      console.error('Error generating story text:', error);
      throw new Error('Failed to generate story text');
    }
  }

  // Generate image prompts for each scene
  static async generateImagePrompts(scenes: string[], artStyle: string): Promise<string[]> {
    try {
      const systemPrompt = `Convert each story scene into a detailed image generation prompt for ${artStyle} style art. 
      Make prompts vivid, specific, and suitable for AI image generation. Include lighting, composition, and mood details.
      Return prompts separated by "|||".`;

      const response = await openai.chat.completions.create({
        model: "gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: scenes.join('\n\n') }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content || '';
      return content.split('|||').map(prompt => prompt.trim()).filter(prompt => prompt.length > 0);
    } catch (error) {
      console.error('Error generating image prompts:', error);
      throw new Error('Failed to generate image prompts');
    }
  }

  // Generate images using OpenAI DALL-E 3
  static async generateImage(prompt: string): Promise<string> {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      return response.data[0]?.url || '';
    } catch (error) {
      console.error('Error generating image:', error);
      // Fallback to Pexels image
      return `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=1024`;
    }
  }

  // Generate audio narration using ElevenLabs
  static async generateAudio(text: string, voiceId: string = 'pNInz6obpgDQGcFmaJgB'): Promise<string> {
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
          },
          responseType: 'blob'
        }
      );

      // Create blob URL for audio playback
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating audio:', error);
      return ''; // Return empty string if audio generation fails
    }
  }

  // Generate video using Runway ML (or similar service)
  static async generateVideo(imageUrl: string, prompt: string): Promise<string> {
    try {
      // This is a placeholder for video generation
      // In reality, you'd integrate with services like Runway ML, Pika Labs, or Stable Video Diffusion
      const response = await axios.post(
        'https://api.runwayml.com/v1/generate',
        {
          image: imageUrl,
          prompt: prompt,
          duration: 4,
          motion: 'medium'
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_RUNWAY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.video_url;
    } catch (error) {
      console.error('Error generating video:', error);
      // Return the static image as fallback
      return imageUrl;
    }
  }

  // Main method to generate complete story with all media
  static async generateCompleteStory(request: StoryGenerationRequest): Promise<StoryScene[]> {
    try {
      // Step 1: Generate story text
      const scenes = await this.generateStoryText(request);
      
      // Step 2: Generate image prompts
      const imagePrompts = await this.generateImagePrompts(scenes, request.artStyle);
      
      // Step 3: Generate images and audio for each scene
      const storyScenes: StoryScene[] = [];
      
      for (let i = 0; i < scenes.length; i++) {
        const sceneId = `scene-${i + 1}-${Date.now()}`;
        const imagePrompt = imagePrompts[i] || `${request.artStyle} illustration of: ${scenes[i]}`;
        
        // Generate image and audio in parallel
        const [imageUrl, audioUrl] = await Promise.all([
          this.generateImage(imagePrompt),
          this.generateAudio(scenes[i])
        ]);

        storyScenes.push({
          id: sceneId,
          text: scenes[i],
          imagePrompt,
          imageUrl,
          audioUrl,
          order: i + 1
        });
      }

      return storyScenes;
    } catch (error) {
      console.error('Error generating complete story:', error);
      throw new Error('Failed to generate story');
    }
  }

  // Regenerate a single scene
  static async regenerateScene(originalScene: StoryScene, request: StoryGenerationRequest): Promise<StoryScene> {
    try {
      // Generate new text for the scene
      const systemPrompt = `Rewrite this story scene with a ${request.tone} tone for ${request.audience} audience. 
      Keep it 2-3 sentences and maintain the story flow. Make it different but thematically consistent.`;

      const textResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: originalScene.text }
        ],
        max_tokens: 200,
        temperature: 0.9
      });

      const newText = textResponse.choices[0]?.message?.content || originalScene.text;

      // Generate new image prompt
      const imagePrompts = await this.generateImagePrompts([newText], request.artStyle);
      const newImagePrompt = imagePrompts[0] || originalScene.imagePrompt;

      // Generate new media
      const [imageUrl, audioUrl] = await Promise.all([
        this.generateImage(newImagePrompt),
        this.generateAudio(newText)
      ]);

      return {
        ...originalScene,
        text: newText,
        imagePrompt: newImagePrompt,
        imageUrl,
        audioUrl
      };
    } catch (error) {
      console.error('Error regenerating scene:', error);
      throw new Error('Failed to regenerate scene');
    }
  }
}