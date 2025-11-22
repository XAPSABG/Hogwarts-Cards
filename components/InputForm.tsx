import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface InputFormProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-neutral-900 rounded-lg p-1 border border-neutral-700">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a character name (e.g. 'Harry Potter' or 'A goblin banker')"
            className="w-full bg-transparent text-neutral-200 px-4 py-3 outline-none placeholder-neutral-500 font-serif"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-amber-600 hover:bg-amber-500 text-white rounded px-6 py-2.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      </form>
      <p className="text-center text-neutral-500 text-sm mt-3 italic">
        "Words are, in my not-so-humble opinion, our most inexhaustible source of magic."
      </p>
    </div>
  );
};
