# AI-Powered Interactive Storytelling Website

A modern web application that generates complete stories with AI-powered text, images, and audio narration.

## Features

- **AI Text Generation**: Uses OpenAI GPT-4 to create engaging stories
- **AI Image Generation**: Creates custom illustrations using DALL-E 3
- **AI Voice Narration**: Generates natural speech using ElevenLabs
- **Video Generation**: Combines scenes into animated videos
- **Interactive Playback**: Scene-by-scene story presentation with audio
- **User Authentication**: Secure login and user management
- **Story Library**: Save and manage your created stories
- **Multiple Export Formats**: Download as PDF, images, or video

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Create a `.env` file in the root directory and add your API keys:

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs API Configuration  
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Stability AI API Configuration (optional)
VITE_STABILITY_API_KEY=your_stability_api_key_here

# Runway ML API Configuration (optional)
VITE_RUNWAY_API_KEY=your_runway_api_key_here
```

### 3. Get API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

#### ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account
3. Go to your Profile settings
4. Copy your API key to the `.env` file

#### Optional: Runway ML (for video generation)
1. Sign up at [Runway ML](https://runwayml.com/)
2. Get your API key from the dashboard
3. Add to `.env` file

### 4. Start the Development Server

```bash
npm run dev
```

## Usage

1. **Sign Up/Login**: Create an account or log in
2. **Create Story**: Enter your story idea and select preferences
3. **Generate**: Click "Generate Story" to create your AI-powered story
4. **Play**: Use the play button to experience your story with narration
5. **Regenerate**: Modify individual scenes or regenerate the entire story
6. **Download**: Export your story as PDF, images, or video

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **AI Services**: 
  - OpenAI GPT-4 (text generation)
  - OpenAI DALL-E 3 (image generation)
  - ElevenLabs (voice synthesis)
  - Runway ML (video generation)
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: React Context

## API Integration Details

### Text Generation
- Uses OpenAI GPT-4 for creative story writing
- Generates 5 scenes per story
- Customizable by genre, tone, and audience

### Image Generation  
- DALL-E 3 creates unique illustrations for each scene
- Prompts are automatically generated from story text
- Fallback to stock images if generation fails

### Voice Synthesis
- ElevenLabs provides natural-sounding narration
- Configurable voice settings
- Audio files are generated for each scene

### Video Generation
- Combines images and audio into animated videos
- Uses pan/zoom effects for visual interest
- Optional background music integration

## Important Notes

- **API Costs**: AI services have usage-based pricing. Monitor your usage.
- **Rate Limits**: APIs have rate limits. The app includes error handling.
- **Browser Compatibility**: Uses modern web APIs. Requires recent browser versions.
- **Security**: API keys are exposed in browser. Use backend proxy for production.

## Production Deployment

For production deployment:

1. Set up a backend API to proxy AI service calls
2. Move API keys to server environment variables
3. Implement proper user authentication with a database
4. Add payment processing for AI service costs
5. Optimize images and implement CDN for media files

## Troubleshooting

- **API Errors**: Check that your API keys are valid and have sufficient credits
- **CORS Issues**: Some AI services may require backend proxy in production
- **Audio Playback**: Ensure browser allows autoplay for the domain
- **Large File Sizes**: Generated images and audio can be large; consider compression

## License

MIT License - see LICENSE file for details