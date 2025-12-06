
import React, { useState } from 'react';
import { Loader2, Sparkles, Dices, Settings2, X, ChevronDown } from 'lucide-react';
import { AspectRatio, IMAGE_STYLES, ImageStyle } from '../types';

interface InputFormProps {
  onGenerate: (prompt: string, aspectRatio: AspectRatio, style: ImageStyle) => void;
  isLoading: boolean;
}

const RANDOM_PROMPTS = [
  "A clumsy Hufflepuff Auror who specializes in herbology",
  "A dark wizard masquerading as a Hogwarts caretaker",
  "The ghost of a Ravenclaw student searching for a lost book",
  "A goblin banker with a secret stash of dragon eggs",
  "A Slytherin Quidditch seeker who is secretly half-giant",
  "An exchange student from Beauxbatons with strange blue hair",
  "A retired wandmaker who now sells cursed artifacts",
  "Harry Potter in his 40s as Head of Auror Office",
  "Hermione Granger as Minister for Magic",
  "Severus Snape if he had survived",
  "A squib who works in the Department of Mysteries",
  "A werewolf professor trying to hide their condition"
];

const ASPECT_RATIOS: AspectRatio[] = ["1:1", "3:4", "4:3", "16:9", "9:16"];

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('4:3');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>('Fantasy Oil Painting');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input, selectedRatio, selectedStyle);
    }
  };

  const handleRandomize = () => {
    const randomPrompt = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setInput(randomPrompt);
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col bg-neutral-900 rounded-lg border border-neutral-700">
          
          {/* Top Row: Input */}
          <div className="flex items-center gap-1 p-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Character name or description..."
              className="w-full bg-transparent text-neutral-200 px-4 py-3 outline-none placeholder-neutral-500 font-serif"
              disabled={isLoading}
            />
            
            <div className="flex gap-1 shrink-0 px-1">
               <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  disabled={isLoading}
                  className={`p-2.5 rounded transition-all ${showSettings ? 'bg-neutral-800 text-amber-500' : 'bg-transparent text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'}`}
                  title="Image Settings"
                >
                  {showSettings ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
               </button>
              
              <button
                type="button"
                onClick={handleRandomize}
                disabled={isLoading}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded px-3 py-2.5 transition-all disabled:opacity-50"
                title="I'm feeling lucky"
              >
                <Dices className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-amber-600 hover:bg-amber-500 text-white rounded px-6 py-2.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span className="hidden sm:inline">Casting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Conjure</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Row: Settings */}
          {showSettings && (
             <div className="p-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="space-y-1.5">
                   <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Aspect Ratio</label>
                   <div className="grid grid-cols-5 gap-1">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setSelectedRatio(ratio)}
                          className={`text-xs py-1.5 rounded border transition-all
                            ${selectedRatio === ratio 
                              ? 'bg-amber-900/40 border-amber-600 text-amber-500' 
                              : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'
                            }`}
                        >
                          {ratio}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Art Style</label>
                   <div className="relative">
                      <select 
                         value={selectedStyle}
                         onChange={(e) => setSelectedStyle(e.target.value as ImageStyle)}
                         className="w-full appearance-none bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs rounded px-3 py-2 focus:outline-none focus:border-amber-600 font-serif"
                      >
                         {IMAGE_STYLES.map(style => (
                            <option key={style} value={style}>{style}</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500 pointer-events-none" />
                   </div>
                </div>
             </div>
          )}

        </div>
      </form>
      <p className="text-center text-neutral-500 text-sm mt-3 italic font-serif opacity-70">
        "Words are, in my not-so-humble opinion, our most inexhaustible source of magic."
      </p>
    </div>
  );
};
