import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { CardData, House } from '../types';
import { StatBar } from './StatBar';
import { Wand2, Fingerprint, Skull, Briefcase, ScrollText, Stamp, Star, Flame, Paperclip, Download, Loader2 } from 'lucide-react';

interface ProfileProps {
  data: CardData;
  imageUrl: string | null;
  isLoadingImage: boolean;
}

const HouseColorMap: Record<House, string> = {
  [House.Gryffindor]: 'text-red-700',
  [House.Slytherin]: 'text-green-800',
  [House.Ravenclaw]: 'text-blue-800',
  [House.Hufflepuff]: 'text-yellow-700',
  [House.Neutral]: 'text-neutral-600',
};

const HouseBorderMap: Record<House, string> = {
    [House.Gryffindor]: 'border-red-900/30',
    [House.Slytherin]: 'border-green-900/30',
    [House.Ravenclaw]: 'border-blue-900/30',
    [House.Hufflepuff]: 'border-yellow-900/30',
    [House.Neutral]: 'border-neutral-500/30',
  };

const HouseCrest: Record<House, string> = {
    [House.Gryffindor]: "🦁",
    [House.Slytherin]: "🐍",
    [House.Ravenclaw]: "🦅",
    [House.Hufflepuff]: "🦡",
    [House.Neutral]: "⚖️"
};

export const Profile: React.FC<ProfileProps> = ({ data, imageUrl, isLoadingImage }) => {
  const houseColor = HouseColorMap[data.house];
  const houseBorder = HouseBorderMap[data.house];
  
  const ref = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fontCss, setFontCss] = useState<string>('');

  // Pre-fetch the Google Fonts CSS to inline it.
  // This avoids the "Cannot access rules" error from html-to-image trying to read the external stylesheet.
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap', {
          mode: 'cors'
        });
        const css = await response.text();
        setFontCss(css);
      } catch (e) {
        console.error("Failed to fetch fonts for archive", e);
      }
    };
    fetchFonts();
  }, []);

  const handleSave = async () => {
    if (ref.current === null) return;
    
    setIsSaving(true);
    try {
      const dataUrl = await toPng(ref.current, { 
        cacheBust: true,
        backgroundColor: '#0a0a0a',
        // Filter out LINK tags to prevent html-to-image from trying to read cross-origin stylesheets
        filter: (node) => {
          return node.tagName !== 'LINK';
        },
        style: {
            transform: 'none',
            margin: '0'
        }
      });
      
      const link = document.createElement('a');
      link.download = `${data.name.replace(/\s+/g, '_')}_Ministry_Record.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to save image', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      
      {/* Action Bar */}
      <div className="flex justify-end">
        <button 
            onClick={handleSave}
            disabled={isSaving || isLoadingImage}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] disabled:opacity-50 disabled:cursor-not-allowed text-amber-500 px-5 py-2.5 rounded-md border border-amber-900/30 transition-all shadow-xl font-serif uppercase tracking-wider text-xs font-bold group"
        >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />}
            <span>{isSaving ? 'Archiving...' : 'Archive Record'}</span>
        </button>
      </div>

      {/* Main Folder Container */}
      <div ref={ref} className="bg-[#f0e6d2] texture-paper text-neutral-800 rounded-sm shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8 md:p-12 border border-[#d4c5a3] relative overflow-hidden min-h-[800px] mx-auto w-full">
        
        {/* Inlined Font Styles for Image Capture */}
        <style>{fontCss}</style>

        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-[0.02] pointer-events-none select-none filter grayscale rotate-12">
            {HouseCrest[data.house]}
        </div>

        {/* Top Stamps */}
        <div className="absolute top-6 right-8 flex flex-col items-end gap-2 opacity-80">
            <div className="border-2 border-red-800/50 text-red-900/60 px-3 py-1 transform -rotate-6 font-display font-bold text-sm uppercase tracking-widest select-none mix-blend-multiply">
                CONFIDENTIAL
            </div>
            <div className="border-2 border-neutral-800/30 text-neutral-900/40 rounded-full w-20 h-20 flex items-center justify-center transform rotate-12 font-mono text-[10px] text-center leading-tight uppercase select-none mix-blend-multiply">
                Ministry of Magic<br/>Records
            </div>
        </div>

        {/* Header Section */}
        <header className="border-b-2 border-neutral-900/10 pb-6 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h6 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">Official Personnel Record</h6>
                    <h1 className="text-5xl font-display font-bold text-neutral-900 tracking-tight leading-none">
                        {data.name}
                    </h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className={`font-bold font-serif text-lg uppercase tracking-wide flex items-center gap-2 ${houseColor}`}>
                            {HouseCrest[data.house]} {data.house}
                        </span>
                        <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                        <span className="text-neutral-600 font-serif italic text-lg">{data.type} {data.subType && `(${data.subType})`}</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end">
                    <span className="font-mono text-xs text-neutral-400">FILE NO.</span>
                    <span className="font-mono text-lg text-neutral-600">{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
            
            {/* LEFT COLUMN (Image & Visuals) */}
            <div className="md:col-span-5 space-y-6">
                
                {/* Photo Attachment */}
                <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-neutral-400">
                        <Paperclip className="w-8 h-8 drop-shadow-sm" />
                    </div>
                    <div className="bg-white p-3 pb-8 shadow-lg border border-neutral-200 rounded-sm">
                        <div className="aspect-[4/5] w-full bg-neutral-100 overflow-hidden border border-neutral-300 relative grayscale-[0.1] sepia-[0.2]">
                            {isLoadingImage ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 gap-2">
                                    <div className="animate-spin w-6 h-6 border-2 border-neutral-400 border-t-transparent rounded-full"></div>
                                    <span className="text-xs font-serif italic">Developing magical photograph...</span>
                                </div>
                            ) : imageUrl ? (
                                <>
                                <img 
                                    src={imageUrl} 
                                    alt={data.name} 
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                                <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-50"></div>
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                                    <span className="text-xs font-mono">NO IMG</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-2 text-center font-hand text-xl text-neutral-600 opacity-80 rotate-1">
                            {data.name}
                        </div>
                    </div>
                </div>

                {/* Basic Physical Stats */}
                <div className="bg-white/40 border border-neutral-900/10 p-4 rounded-sm space-y-2">
                     <div className="flex justify-between items-center border-b border-neutral-900/5 pb-2">
                        <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">Defense Rating (HP)</span>
                        <span className="font-mono font-bold text-lg text-neutral-800">{data.hp}</span>
                     </div>
                     <div className="flex justify-between items-center pt-1">
                        <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">Class Rarity</span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                            data.rarity === 'Mythic' ? 'bg-orange-100 text-orange-800 border-orange-200' : 
                            'bg-neutral-100 text-neutral-600 border-neutral-200'
                        }`}>
                            {data.rarity}
                        </span>
                     </div>
                </div>

                 {/* Equipment */}
                 <section>
                    <h4 className={`font-display font-bold text-neutral-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider`}>
                        <Briefcase size={14} /> Equipment & Artifacts
                    </h4>
                    <ul className="bg-[#e6dec8] border border-[#d1c7b0] p-4 space-y-3 text-sm font-serif shadow-inner rounded-sm">
                        {data.wand && (
                             <li className="flex items-start gap-2 pb-2 border-b border-neutral-900/5">
                                <Wand2 className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-bold text-neutral-800 text-xs uppercase block opacity-70">Wand</span>
                                    <span className="text-neutral-900 italic">{data.wand}</span>
                                </div>
                             </li>
                        )}
                        {data.equipment && data.equipment.length > 0 ? (
                            data.equipment.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <ScrollText className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-neutral-800">{item}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-neutral-400 italic text-xs">No notable equipment logged.</li>
                        )}
                    </ul>
                </section>

            </div>

            {/* RIGHT COLUMN (Data & Lore) */}
            <div className="md:col-span-7 space-y-8">
                
                {/* Biography */}
                <section>
                    <h4 className={`font-display font-bold text-neutral-800 border-b-2 ${houseBorder} mb-4 pb-1 flex items-center gap-2`}>
                        <Stamp size={16} /> Biography & History
                    </h4>
                    <p className="text-base font-serif leading-relaxed text-neutral-800 text-justify drop-shadow-sm">
                        {data.biography}
                    </p>
                    
                    {data.flavorText && (
                         <div className="mt-4 pl-4 border-l-4 border-neutral-400 italic text-neutral-600 text-sm font-serif">
                            "{data.flavorText}"
                         </div>
                    )}
                </section>

                {/* Stats */}
                <section>
                    <h4 className={`font-display font-bold text-neutral-800 border-b-2 ${houseBorder} mb-4 pb-1 flex items-center gap-2`}>
                        <Fingerprint size={16} /> Magical Aptitude Test Results
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        <StatBar label="Magical Power" value={data.stats.magic} colorClass="bg-neutral-800" />
                        <StatBar label="Courage" value={data.stats.courage} colorClass="bg-red-800" />
                        <StatBar label="Intelligence" value={data.stats.intelligence} colorClass="bg-blue-800" />
                        <StatBar label="Cunning" value={data.stats.cunning} colorClass="bg-green-800" />
                        <StatBar label="Loyalty" value={data.stats.loyalty} colorClass="bg-yellow-600" />
                    </div>
                </section>

                {/* Spells & Abilities */}
                <section>
                    <h4 className={`font-display font-bold text-neutral-800 border-b-2 ${houseBorder} mb-4 pb-1 flex items-center gap-2`}>
                        <Flame size={16} /> Known Spells & Abilities
                    </h4>
                    <div className="space-y-4">
                        {data.abilities.map((ability, idx) => (
                            <div key={idx} className="bg-white/30 border border-neutral-900/5 p-3 rounded hover:bg-white/50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-bold text-neutral-900 font-serif text-lg">{ability.name}</h5>
                                    <span className="text-[10px] font-mono border border-neutral-300 rounded px-1.5 py-0.5 text-neutral-500 uppercase bg-neutral-50">
                                        Cost: {ability.cost}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-700 leading-snug font-serif">
                                    {ability.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Traits */}
                <div className="grid grid-cols-2 gap-6">
                    <section>
                        <h4 className="font-display font-bold text-green-800 text-sm uppercase tracking-wider mb-2 border-b border-green-800/20 pb-1">
                             Assessed Strengths
                        </h4>
                        <ul className="text-sm font-serif space-y-2 text-neutral-700">
                            {data.strengths?.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 leading-tight">
                                    <Star className="w-3 h-3 text-green-600 mt-1 flex-shrink-0 fill-green-600" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h4 className="font-display font-bold text-red-800 text-sm uppercase tracking-wider mb-2 border-b border-red-800/20 pb-1">
                            Identified Weaknesses
                        </h4>
                        <ul className="text-sm font-serif space-y-2 text-neutral-700">
                            {data.weaknesses?.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 leading-tight">
                                    <Skull className="w-3 h-3 text-red-600 mt-1 flex-shrink-0" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

            </div>
        </div>

        {/* Footer Code */}
        <div className="mt-12 pt-4 border-t border-neutral-800/10 flex flex-col md:flex-row justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            <span>Generated by The Department of Mysteries</span>
            <span>Magic is Might // Laws of Magic Section 7B</span>
        </div>
      </div>
    </div>
  );
};