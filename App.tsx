
import React, { useState, useEffect } from 'react';
import { CardData } from './types';
import { generateCharacterData, generateCharacterImage } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { Profile } from './components/Profile';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example initial load (optional, keeps page from being empty)
  useEffect(() => {
    // We can leave it empty or load a preset. Let's keep it clean.
  }, []);

  const handleGenerate = async (prompt: string) => {
    setIsLoadingData(true);
    setIsLoadingImage(true);
    setError(null);
    setCardData(null);
    setImageUrl(null);

    try {
      // 1. Generate Data
      const data = await generateCharacterData(prompt);
      setCardData(data);
      setIsLoadingData(false);

      // 2. Generate Image based on the AI's visual description of the character
      // We pass the character name explicitly to help the AI match the likeness of canon characters
      if (data.visualDescription) {
        const imageBase64 = await generateCharacterImage(data.visualDescription, data.name);
        setImageUrl(imageBase64);
      } else {
        // Fallback if no visual description
        const imageBase64 = await generateCharacterImage(`Portrait of ${data.name}, Harry Potter style art`, data.name);
        setImageUrl(imageBase64);
      }
    } catch (err) {
      console.error(err);
      setError("The spell backfired! Please try again.");
      setIsLoadingData(false);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col items-center py-12 px-4 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
      
      {/* Header */}
      <div className="text-center mb-10 space-y-2">
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-900/20 rounded-full border border-amber-700/50">
                <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-sm">
          Hogwarts Archives
        </h1>
        <p className="text-neutral-400 max-w-md mx-auto font-serif">
          Access the Ministry of Magic's personnel files.
        </p>
      </div>

      {/* Input */}
      <InputForm onGenerate={handleGenerate} isLoading={isLoadingData} />

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-3 rounded-lg mb-8 animate-in fade-in slide-in-from-top-4">
          {error}
        </div>
      )}

      {/* Content Area */}
      {(isLoadingData || cardData) && (
        <div className="w-full flex justify-center animate-in fade-in duration-700 slide-in-from-bottom-8 px-4 pb-20">
            {cardData ? (
              <Profile 
                data={cardData} 
                imageUrl={imageUrl}
                isLoadingImage={isLoadingImage}
              />
            ) : (
              // Skeleton Profile
              <div className="w-full max-w-3xl h-96 bg-neutral-900/50 rounded-xl border border-neutral-800/50 animate-pulse flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                  <span className="text-amber-700 font-serif italic">Retrieving files from the Department of Mysteries...</span>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default App;
