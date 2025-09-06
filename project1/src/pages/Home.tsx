import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StoryScene, AIService } from '../services/aiService';
import { StoryRequest } from '../types';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import StoryGenerator from '../components/Story/StoryGenerator';
import StoryDisplay from '../components/Story/StoryDisplay';

const Home: React.FC = () => {
  const [generatedScenes, setGeneratedScenes] = useState<StoryScene[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleStoryGenerated = (scenes: StoryScene[]) => {
    setGeneratedScenes(scenes);
  };

  const handleRegenerateScene = async (sceneId: string) => {
    setIsRegenerating(true);
    try {
      const sceneIndex = generatedScenes.findIndex(scene => scene.id === sceneId);
      if (sceneIndex !== -1) {
        const originalScene = generatedScenes[sceneIndex];
        
        // Create a story request from the current scene context
        const storyRequest: StoryRequest = {
          prompt: originalScene.text,
          genre: 'fantasy', // You might want to store these values
          tone: 'adventurous',
          audience: 'children',
          artStyle: 'cartoon'
        };

        const regeneratedScene = await AIService.regenerateScene(originalScene, storyRequest);
        
        const newScenes = [...generatedScenes];
        newScenes[sceneIndex] = regeneratedScene;
        setGeneratedScenes(newScenes);
      }
    } catch (error) {
      console.error('Error regenerating scene:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRegenerateAll = () => {
    // Reset to trigger regeneration
    setGeneratedScenes([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Magical Stories with AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your ideas into beautiful illustrated stories with AI-generated text, images, narration, 
            stunning visuals, and captivating videos.
          </p>
        </motion.div>

        <StoryGenerator onStoryGenerated={handleStoryGenerated} />
        
        {generatedScenes.length > 0 && (
          <>
            {isRegenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700">Regenerating scene...</span>
                </div>
              </motion.div>
            )}
          <StoryDisplay
            scenes={generatedScenes}
            onRegenerateScene={handleRegenerateScene}
            onRegenerateAll={handleRegenerateAll}
          />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;