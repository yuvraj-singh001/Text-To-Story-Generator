import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, RefreshCw } from 'lucide-react';
import { StoryRequest } from '../../types';
import { AIService, StoryScene } from '../../services/aiService';
import Button from '../UI/Button';

interface StoryGeneratorProps {
  onStoryGenerated: (scenes: StoryScene[]) => void;
}

const StoryGenerator: React.FC<StoryGeneratorProps> = ({ onStoryGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('fantasy');
  const [tone, setTone] = useState('adventurous');
  const [audience, setAudience] = useState('children');
  const [artStyle, setArtStyle] = useState('cartoon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const genres = ['fantasy', 'sci-fi', 'mystery', 'romance', 'adventure', 'comedy'];
  const tones = ['adventurous', 'mysterious', 'funny', 'heartwarming', 'dramatic', 'inspiring'];
  const audiences = ['children', 'young-adult', 'adults', 'all-ages'];
  const artStyles = ['cartoon', 'realistic', 'watercolor', 'anime', 'vintage', 'minimalist'];


  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError('');
    
    try {
      const storyRequest: StoryRequest = {
        prompt,
        genre,
        tone,
        audience,
        artStyle
      };

      const scenes = await AIService.generateCompleteStory(storyRequest);
      onStoryGenerated(scenes);
    } catch (err) {
      setError('Failed to generate story. Please check your API keys and try again.');
      console.error('Story generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-lg p-8 mb-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Wand2 className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">Create Your Story</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Idea
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your story idea in a sentence or paragraph..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
          >
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {genres.map(g => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {tones.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {audiences.map(a => (
                <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Art Style</label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {artStyles.map(a => (
                <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!prompt.trim()}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Story...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Story</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StoryGenerator;