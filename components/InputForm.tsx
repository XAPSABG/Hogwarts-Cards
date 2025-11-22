import React, { useState } from 'react';
import { Loader2, Sparkles, Dices } from 'lucide-react';

interface InputFormProps {
  onGenerate: (prompt: string) => void;
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

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input);
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
        <div className="relative flex flex-col sm:flex-row items-center bg-neutral-900 rounded-lg p-1 border border-neutral-700 gap-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Character name or description..."
            className="w-full bg-transparent text-neutral-200 px-4 py-3 outline-none placeholder-neutral-500 font-serif"
            disabled={isLoading}
          />
          <div className="flex gap-1 w-full sm:w-auto px-1 pb-1 sm:pb-0">
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
              className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-500 text-white rounded px-6 py-2.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Casting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Conjure</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      <p className="text-center text-neutral-500 text-sm mt-3 italic font-serif opacity-70">
        "Words are, in my not-so-humble opinion, our most inexhaustible source of magic."
      </p>
    </div>
  );
};