import React, { useState, useEffect } from 'react';
import { CardData } from './types';
import { generateCharacterData, generateCharacterImage } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { Card } from './components/Card';
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
      // We pass the visualDescription from the data response
      if (data.visualDescription) {
        const imageBase64 = await generateCharacterImage(data.visualDescription);
        setImageUrl(imageBase64);
      } else {
        // Fallback if no visual description
        const imageBase64 = await generateCharacterImage(`Portrait of ${data.name}, Harry Potter style art`);
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
          Conjure a magical profile and trading card for any witch, wizard, or beast.
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
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-start justify-center animate-in fade-in duration-700 slide-in-from-bottom-8">
          
          {/* Left Column: Card */}
          <div className="flex-shrink-0 mx-auto lg:mx-0 perspective-1000">
             {cardData ? (
               <Card 
                 data={cardData} 
                 imageUrl={imageUrl} 
                 isLoadingImage={isLoadingImage} 
               />
             ) : (
               // Skeleton Card while loading data
               <div className="w-[360px] h-[520px] bg-neutral-900 rounded-xl border border-neutral-800 animate-pulse flex items-center justify-center">
                 <span className="text-neutral-600 font-serif italic">Consulting the sorting hat...</span>
               </div>
             )}
          </div>

          {/* Right Column: Profile Details */}
          <div className="flex-grow w-full flex justify-center lg:justify-start">
            {cardData ? (
              <Profile data={cardData} />
            ) : (
              // Skeleton Profile
              <div className="w-full max-w-md h-96 bg-neutral-900/50 rounded-xl border border-neutral-800/50 animate-pulse" />
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default App;
