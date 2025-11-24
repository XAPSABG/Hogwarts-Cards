
import React, { useState, useEffect } from 'react';
import { CardData, UserTier } from './types';
import { generateCharacterData, generateCharacterImage } from './services/geminiService';
import { InputForm } from './components/InputForm';
import { Profile } from './components/Profile';
import { Sparkles, ShieldCheck, Key, Scroll, Crown } from 'lucide-react';

const App: React.FC = () => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tier Management
  const [userTier, setUserTier] = useState<UserTier | null>(null);

  const handleSelectFreeTier = () => {
      setUserTier('free');
  };

  const handleSelectPaidTier = async () => {
    if (window.aistudio) {
        try {
            await window.aistudio.openSelectKey();
            // Assuming successful selection if the modal closes and code continues
            setUserTier('paid');
        } catch (e) {
            console.error("Key selection failed", e);
        }
    } else {
        // Fallback for dev without injection
        setUserTier('paid'); 
    }
  };

  const handleGenerate = async (prompt: string) => {
    if (!userTier) return;

    setIsLoadingData(true);
    setIsLoadingImage(true);
    setError(null);
    setCardData(null);
    setImageUrl(null);

    try {
      // 1. Generate Data with tier-specific model
      const data = await generateCharacterData(prompt, userTier);
      setCardData(data);
      setIsLoadingData(false);

      // 2. Generate Image with tier-specific model
      if (data.visualDescription) {
        const imageBase64 = await generateCharacterImage(data.visualDescription, data.name, userTier);
        setImageUrl(imageBase64);
      } else {
        const imageBase64 = await generateCharacterImage(`Portrait of ${data.name}, Harry Potter style art`, data.name, userTier);
        setImageUrl(imageBase64);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("429")) {
        setError("The Ministry Archives are currently overwhelmed. Please check your magical quota (Rate Limit).");
      } else {
        setError("The spell backfired! Please try again.");
      }
      setIsLoadingData(false);
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Tier Selection Screen
  if (!userTier) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
             <div className="max-w-2xl w-full bg-[#1a1a1a] border border-neutral-800 rounded-lg p-8 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-700 via-amber-500 to-neutral-700"></div>
                
                <div className="text-center space-y-2">
                    <h1 className="font-display text-3xl text-neutral-200">Ministry of Magic Archives</h1>
                    <p className="text-neutral-500 font-serif">Select your security clearance level to proceed.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Tier */}
                    <button 
                        onClick={handleSelectFreeTier}
                        className="group relative flex flex-col items-center p-6 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-all text-center gap-4 hover:border-neutral-500"
                    >
                         <div className="p-3 bg-neutral-900 rounded-full border border-neutral-700 group-hover:scale-110 transition-transform">
                             <Scroll className="w-8 h-8 text-neutral-400" />
                         </div>
                         <div>
                             <h3 className="font-display text-lg text-neutral-300">Standard Access</h3>
                             <p className="text-xs text-neutral-500 mt-1">General Records & Standard Portraits</p>
                         </div>
                         <div className="mt-auto pt-4 text-[10px] text-green-600 font-mono border-t border-neutral-800 w-full">
                             FREE USE ALLOWED
                         </div>
                    </button>

                    {/* Paid Tier */}
                    <button 
                        onClick={handleSelectPaidTier}
                        className="group relative flex flex-col items-center p-6 border border-amber-900/40 bg-amber-950/10 rounded-lg hover:bg-amber-900/20 transition-all text-center gap-4 hover:border-amber-700/60"
                    >
                         <div className="absolute -top-1 -right-1">
                             <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                             </span>
                         </div>
                         <div className="p-3 bg-amber-900/20 rounded-full border border-amber-800/50 group-hover:scale-110 transition-transform">
                             <Crown className="w-8 h-8 text-amber-500" />
                         </div>
                         <div>
                             <h3 className="font-display text-lg text-amber-500">Auror Clearance</h3>
                             <p className="text-xs text-amber-800/80 mt-1">Deep Lore Intelligence & High-Fidelity Art</p>
                         </div>
                         <div className="mt-auto pt-4 text-[10px] text-amber-600 font-mono border-t border-amber-900/30 w-full">
                             REQUIRES API KEY
                         </div>
                    </button>
                </div>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col items-center py-12 px-4 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
      
      {/* Header */}
      <div className="text-center mb-10 space-y-2 relative">
        <div className="absolute top-0 right-0 md:absolute md:top-2 md:right-0">
            {userTier === 'paid' ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-900/20 border border-amber-700/50 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                    <Crown size={10} /> Auror Clearance
                </div>
            ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/50 border border-neutral-700 rounded-full text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    <Scroll size={10} /> Standard Access
                </div>
            )}
        </div>

        <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-900/20 rounded-full border border-amber-700/50">
                <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 drop-shadow-sm font-display">
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
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-3 rounded-lg mb-8 animate-in fade-in slide-in-from-top-4 font-serif flex items-center gap-3">
          <ShieldCheck className="w-5 h-5" />
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
