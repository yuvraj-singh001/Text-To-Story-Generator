import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Download, FileText, Image, Video, Volume2, VolumeX } from 'lucide-react';
import { StoryScene } from '../../services/aiService';
import { VideoService } from '../../services/videoService';
import Button from '../UI/Button';

interface StoryDisplayProps {
  scenes: StoryScene[];
  onRegenerateScene: (sceneId: string) => void;
  onRegenerateAll: () => void;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ scenes, onRegenerateScene, onRegenerateAll }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playCurrentScene();
      const interval = setInterval(() => {
        setCurrentScene(prev => {
          if (prev >= scenes.length - 1) {
            setIsPlaying(false);
            stopCurrentAudio();
            clearInterval(interval);
            return 0;
          }
          playSceneAudio(prev + 1);
          return prev + 1;
        });
      }, 4000);
    } else {
      setIsPlaying(false);
      stopCurrentAudio();
    }
  };

  const playCurrentScene = () => {
    playSceneAudio(currentScene);
  };

  const playSceneAudio = (sceneIndex: number) => {
    if (isMuted) return;
    
    stopCurrentAudio();
    
    const scene = scenes[sceneIndex];
    if (scene?.audioUrl) {
      const audio = new Audio(scene.audioUrl);
      audio.play().catch(console.error);
      setCurrentAudio(audio);
    }
  };

  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopCurrentAudio();
    }
  };

  const generateVideo = async () => {
    setIsGeneratingVideo(true);
    try {
      const video = await VideoService.createStoryVideo(scenes);
      setVideoUrl(video);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDownload = (type: 'pdf' | 'images' | 'video') => {
    if (type === 'pdf') {
      // Generate PDF from scenes
      const pdfContent = scenes.map((scene, index) => 
        `Scene ${index + 1}:\n${scene.text}\n\n`
      ).join('');
      
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'story.txt';
      a.click();
    } else if (type === 'images') {
      // Download images as zip (simplified version)
      scenes.forEach((scene, index) => {
        if (scene.imageUrl) {
          const a = document.createElement('a');
          a.href = scene.imageUrl;
          a.download = `scene-${index + 1}.jpg`;
          a.click();
        }
      });
    } else if (type === 'video' && videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'story-video.mp4';
      a.click();
    }
  };

  if (scenes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Story</h2>
        <div className="flex space-x-2">
          <Button
            onClick={handlePlay}
            variant="primary"
            className="flex items-center space-x-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
          <Button
            onClick={toggleMute}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            onClick={generateVideo}
            loading={isGeneratingVideo}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Video className="h-4 w-4" />
            <span>Generate Video</span>
          </Button>
          <Button
            onClick={onRegenerateAll}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Regenerate All</span>
          </Button>
        </div>
      </div>

      {/* Video Player Area */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 rounded-lg mb-8 p-4"
      >
        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={scenes[currentScene]?.imageUrl}
                  alt={`Scene ${currentScene + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white text-lg leading-relaxed">
                    {scenes[currentScene]?.text}
                  </p>
                  <div className="mt-2 text-white/60 text-sm">
                    Scene {currentScene + 1} of {scenes.length}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Play className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 text-lg">Click Play to watch your story come to life</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Download Options */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          onClick={() => handleDownload('pdf')}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
        <Button
          onClick={() => handleDownload('images')}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Image className="h-4 w-4" />
          <span>Download Images</span>
        </Button>
        <Button
          onClick={() => handleDownload('video')}
          disabled={!videoUrl}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Video className="h-4 w-4" />
          <span>{videoUrl ? 'Download Video' : 'Generate Video First'}</span>
        </Button>
      </div>

      {/* Scene-by-Scene Display */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Scene by Scene</h3>
        {scenes.map((scene, index) => (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`border-2 rounded-lg p-6 transition-all duration-300 ${
              isPlaying && index === currentScene 
                ? 'border-indigo-500 shadow-lg bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={scene.imageUrl}
                  alt={`Scene ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {scene.audioUrl && (
                  <button
                    onClick={() => playSceneAudio(index)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <Volume2 className="h-4 w-4 text-gray-700" />
                  </button>
                )}
              </div>
              <div className="md:w-2/3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-900">Scene {index + 1}</h4>
                  <Button
                    onClick={() => onRegenerateScene(scene.id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Regenerate</span>
                  </Button>
                </div>
                <p className="text-gray-700 leading-relaxed">{scene.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StoryDisplay;