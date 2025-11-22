
import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { CardData, House } from '../types';
import { StatBar } from './StatBar';
import { 
  Wand2, Fingerprint, Skull, Briefcase, Stamp, Star, 
  Flame, Paperclip, Download, Loader2, Zap, Snowflake, Heart, 
  Shield, Brain, FlaskConical, Wind, Leaf, Sparkles, Ghost, GraduationCap,
  CheckCircle2, PawPrint, Eye, AlertTriangle, Users, Siren
} from 'lucide-react';

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

// Helper to determine icon based on ability keywords
const getAbilityIcon = (name: string, desc: string) => {
  const text = (name + " " + desc).toLowerCase();
  
  if (text.includes('fire') || text.includes('burn') || text.includes('incendio') || text.includes('flame')) 
    return <Flame className="w-5 h-5 text-orange-600" />;
  
  if (text.includes('ice') || text.includes('freeze') || text.includes('cold') || text.includes('glacius')) 
    return <Snowflake className="w-5 h-5 text-cyan-600" />;
  
  if (text.includes('lightning') || text.includes('shock') || text.includes('stun') || text.includes('thunder')) 
    return <Zap className="w-5 h-5 text-yellow-600" />;
  
  if (text.includes('heal') || text.includes('repair') || text.includes('life') || text.includes('episkey')) 
    return <Heart className="w-5 h-5 text-red-600" />;
  
  if (text.includes('shield') || text.includes('protect') || text.includes('defend') || text.includes('block')) 
    return <Shield className="w-5 h-5 text-blue-600" />;
  
  if (text.includes('dark') || text.includes('curse') || text.includes('death') || text.includes('avada')) 
    return <Skull className="w-5 h-5 text-purple-900" />;
  
  if (text.includes('mind') || text.includes('memory') || text.includes('thought') || text.includes('obliviate')) 
    return <Brain className="w-5 h-5 text-pink-600" />;
  
  if (text.includes('poison') || text.includes('potion') || text.includes('acid') || text.includes('venom')) 
    return <FlaskConical className="w-5 h-5 text-green-600" />;
  
  if (text.includes('wind') || text.includes('fly') || text.includes('levitate') || text.includes('air')) 
    return <Wind className="w-5 h-5 text-slate-500" />;
  
  if (text.includes('plant') || text.includes('root') || text.includes('nature') || text.includes('earth')) 
    return <Leaf className="w-5 h-5 text-green-700" />;
  
  return <Sparkles className="w-5 h-5 text-amber-600" />;
};

export const Profile: React.FC<ProfileProps> = ({ data, imageUrl, isLoadingImage }) => {
  const houseColor = HouseColorMap[data.house];
  const houseBorder = HouseBorderMap[data.house];
  
  const ref = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fontCss, setFontCss] = useState<string>('');

  // Pre-fetch the Google Fonts CSS to inline it.
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
    setSaveSuccess(false);
    try {
      const dataUrl = await toPng(ref.current, { 
        cacheBust: true,
        backgroundColor: '#f0e6d2',
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
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save image', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getDangerLevelColor = (level: number) => {
      if (level <= 3) return 'bg-green-600';
      if (level <= 6) return 'bg-yellow-500';
      if (level <= 8) return 'bg-orange-600';
      return 'bg-red-700';
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6">
      
      {/* Action Bar */}
      <div className="flex justify-end">
        <button 
            onClick={handleSave}
            disabled={isSaving || isLoadingImage}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md border transition-all shadow-xl font-serif uppercase tracking-wider text-xs font-bold group
                ${saveSuccess 
                    ? 'bg-green-900/20 border-green-600 text-green-400' 
                    : 'bg-[#1a1a1a] hover:bg-[#252525] border-amber-900/30 text-amber-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
            ) : saveSuccess ? (
                <CheckCircle2 size={16} />
            ) : (
                <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
            )}
            <span>{isSaving ? 'Archiving...' : saveSuccess ? 'Saved to Records' : 'Archive Record'}</span>
        </button>
      </div>

      {/* Main Folder Container */}
      <div ref={ref} className="bg-[#f0e6d2] texture-paper text-neutral-800 rounded-sm shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-6 sm:p-8 md:p-12 border border-[#d4c5a3] relative overflow-hidden min-h-[1000px] mx-auto w-full flex flex-col">
        
        {/* Inlined Font Styles for Image Capture */}
        <style>{fontCss}</style>

        {/* Background Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] opacity-[0.02] pointer-events-none select-none filter grayscale rotate-12">
            {HouseCrest[data.house]}
        </div>

        {/* Top Stamps */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex flex-col items-end gap-2 opacity-80">
            <div className="border-2 border-red-800/50 text-red-900/60 px-3 py-1 transform -rotate-6 font-display font-bold text-sm uppercase tracking-widest select-none mix-blend-multiply">
                CONFIDENTIAL
            </div>
            <div className="hidden sm:flex border-2 border-neutral-800/30 text-neutral-900/40 rounded-full w-20 h-20 items-center justify-center transform rotate-12 font-mono text-[10px] text-center leading-tight uppercase select-none mix-blend-multiply">
                Ministry of Magic<br/>Records
            </div>
        </div>

        {/* Header Section */}
        <header className="border-b-2 border-neutral-900/10 pb-6 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                         <h6 className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Personnel File No. {Math.random().toString(36).substring(2, 8).toUpperCase()}</h6>
                         {data.bloodStatus && (
                             <span className="px-1.5 py-0.5 border border-neutral-400 rounded text-[9px] font-bold text-neutral-600 uppercase tracking-wider">{data.bloodStatus}</span>
                         )}
                         {data.animagus && (
                             <span className="px-1.5 py-0.5 border border-neutral-400 rounded text-[9px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1">
                                 <PawPrint size={10} /> Registered Animagus
                             </span>
                         )}
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl font-display font-bold text-neutral-900 tracking-tight leading-none">
                        {data.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className={`font-bold font-serif text-lg uppercase tracking-wide flex items-center gap-2 ${houseColor}`}>
                            {HouseCrest[data.house]} {data.house}
                        </span>
                        <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                        <span className="text-neutral-600 font-serif italic text-lg">{data.type}</span>
                    </div>
                    {/* Titles */}
                    {data.titles && data.titles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                           {data.titles.map((title, i) => (
                               <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-800 text-[#f0e6d2] rounded-full flex items-center gap-1">
                                 <Star size={8} className="fill-current" />
                                 {title}
                               </span>
                           ))}
                        </div>
                    )}
                </div>
                
                {/* Danger Level Gauge */}
                <div className="md:w-48 shrink-0 bg-neutral-900/5 p-3 rounded border border-neutral-900/10">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                            <AlertTriangle size={10} /> Threat Level
                        </span>
                        <span className="font-mono font-bold text-neutral-800">{data.dangerLevel}/10</span>
                    </div>
                    <div className="h-2 bg-neutral-300 rounded-full overflow-hidden flex">
                        {Array.from({length: 10}).map((_, i) => (
                            <div key={i} className={`flex-1 border-r border-white/20 ${i < data.dangerLevel ? getDangerLevelColor(data.dangerLevel) : 'bg-transparent'}`}></div>
                        ))}
                    </div>
                    <div className="text-[9px] text-right mt-1 font-mono text-neutral-400 uppercase">
                        {data.dangerLevel >= 7 ? "EXTREME CAUTION" : data.dangerLevel >= 4 ? "MONITOR CLOSELY" : "LOW RISK"}
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 flex-1">
            
            {/* LEFT COLUMN (Image & Visuals) */}
            <div className="md:col-span-5 space-y-6">
                
                {/* Photo Attachment */}
                <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-500 group">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-neutral-400">
                        <Paperclip className="w-8 h-8 drop-shadow-sm" />
                    </div>
                    <div className="bg-white p-3 pb-10 shadow-lg border border-neutral-200 rounded-sm">
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
                        <div className="absolute bottom-3 left-0 w-full text-center font-hand text-2xl text-neutral-600 opacity-80 -rotate-1">
                            {data.name}
                        </div>
                    </div>
                </div>

                 {/* Lore Details (Wand, Patronus, etc) */}
                 <section className="space-y-4">
                    
                    {/* Wand Module */}
                    {data.wand && (
                        <div className="bg-[#e6dec8] border border-[#d1c7b0] p-4 shadow-sm rounded-sm relative overflow-hidden">
                            <Wand2 className="absolute right-2 top-2 w-16 h-16 text-neutral-900/5 rotate-45" />
                            <h4 className="font-display font-bold text-neutral-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Wand2 size={14} /> Wand Registry
                            </h4>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm font-serif relative z-10">
                                <div>
                                    <span className="text-[9px] uppercase text-neutral-500 font-bold block">Wood</span>
                                    <span className="text-neutral-900 font-bold">{data.wand.wood}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] uppercase text-neutral-500 font-bold block">Core</span>
                                    <span className="text-neutral-900">{data.wand.core}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] uppercase text-neutral-500 font-bold block">Length</span>
                                    <span className="text-neutral-900">{data.wand.length}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] uppercase text-neutral-500 font-bold block">Flexibility</span>
                                    <span className="text-neutral-900 italic">{data.wand.flexibility}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Magical Biology */}
                    <div className="space-y-2">
                        {/* Familiar */}
                        {data.familiar && (
                             <div className="bg-white/40 border border-neutral-900/10 p-3 rounded-sm flex items-center gap-3">
                                <div className="p-2 bg-neutral-900/5 rounded-full shrink-0">
                                    <PawPrint className="w-4 h-4 text-neutral-700" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold uppercase text-neutral-500 block tracking-wide">Registered Companion</span>
                                    <span className="text-neutral-900 font-serif font-bold text-sm leading-tight block">{data.familiar}</span>
                                </div>
                             </div>
                        )}
                        {/* Animagus */}
                        {data.animagus && (
                             <div className="bg-white/40 border border-neutral-900/10 p-3 rounded-sm flex items-center gap-3">
                                <div className="p-2 bg-neutral-900/5 rounded-full shrink-0">
                                    <Eye className="w-4 h-4 text-neutral-700" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold uppercase text-neutral-500 block tracking-wide">Animagus Form</span>
                                    <span className="text-neutral-900 font-serif font-bold text-sm leading-tight block">{data.animagus}</span>
                                </div>
                             </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Patronus */}
                        {data.patronus && (
                            <div className="bg-white/40 border border-neutral-900/10 p-3 rounded-sm">
                                <div className="flex items-center gap-2 mb-1 text-blue-800">
                                    <Ghost size={14} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Patronus</span>
                                </div>
                                <span className="text-neutral-900 font-serif text-sm font-bold leading-tight block">{data.patronus}</span>
                            </div>
                        )}
                        {/* Boggart */}
                        {data.boggart && (
                            <div className="bg-white/40 border border-neutral-900/10 p-3 rounded-sm">
                                <div className="flex items-center gap-2 mb-1 text-red-900">
                                    <Skull size={14} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Boggart</span>
                                </div>
                                <span className="text-neutral-900 font-serif text-sm leading-tight block">{data.boggart}</span>
                            </div>
                        )}
                    </div>
                </section>

                 {/* Equipment */}
                 {data.equipment && data.equipment.length > 0 && (
                    <section className="pt-2">
                        <h4 className={`font-display font-bold text-neutral-600 text-xs uppercase tracking-wider mb-2 pl-1 flex items-center gap-2`}>
                            <Briefcase size={12} /> Known Possessions
                        </h4>
                        <ul className="space-y-1 text-sm font-serif pl-1">
                            {data.equipment.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-neutral-800 bg-neutral-900/5 px-2 py-1.5 rounded-sm border border-neutral-900/5">
                                    <span className="text-neutral-400 mt-1.5 w-1 h-1 bg-neutral-500 rounded-full shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                 )}

            </div>

            {/* RIGHT COLUMN (Data & Lore) */}
            <div className="md:col-span-7 space-y-8">
                
                {/* Affiliations */}
                {data.affiliations && data.affiliations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {data.affiliations.map((aff, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-neutral-200 text-neutral-700 border border-neutral-300 rounded-sm flex items-center gap-1.5">
                                <Users size={10} /> {aff}
                            </span>
                        ))}
                    </div>
                )}

                {/* Biography */}
                <section>
                    <h4 className={`font-display font-bold text-neutral-800 border-b-2 ${houseBorder} mb-4 pb-1 flex items-center gap-2`}>
                        <Stamp size={16} /> Biography & History
                    </h4>
                    <div className="prose prose-sm text-neutral-800 font-serif leading-relaxed text-justify">
                        <p className="first-letter:text-3xl first-letter:font-display first-letter:mr-1 first-letter:float-left">
                            {data.biography}
                        </p>
                    </div>
                    
                    {data.flavorText && (
                         <div className="mt-4 pl-4 border-l-4 border-neutral-400 italic text-neutral-600 text-sm font-serif bg-neutral-900/5 py-2 pr-2 rounded-r">
                            "{data.flavorText}"
                         </div>
                    )}
                </section>

                {/* Psychological Profile (Paperclip note style) */}
                <section className="relative bg-[#fff9e6] text-neutral-800 p-4 shadow-md rotate-1 border border-neutral-200 mx-2">
                    <div className="absolute -top-3 right-10 text-neutral-400 transform rotate-45">
                        <Paperclip className="w-6 h-6" />
                    </div>
                    <h5 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-3 border-b border-neutral-300 pb-1">Psychological Evaluation</h5>
                    <div className="space-y-3 font-serif text-sm">
                        <div>
                             <div className="flex items-center gap-1.5 text-pink-700 font-bold mb-1 text-xs uppercase tracking-wide">
                                 <Heart size={12} /> Amortentia (Attractions)
                             </div>
                             <p className="leading-snug pl-4 italic text-neutral-700">
                                 {data.amortentia?.join(", ")}
                             </p>
                        </div>
                        <div>
                             <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1 text-xs uppercase tracking-wide">
                                 <Sparkles size={12} /> Mirror of Erised (Desires)
                             </div>
                             <p className="leading-snug pl-4 italic text-neutral-700">
                                 "{data.mirrorOfErised}"
                             </p>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section>
                    <h4 className={`font-display font-bold text-neutral-800 border-b-2 ${houseBorder} mb-4 pb-1 flex items-center gap-2`}>
                        <Fingerprint size={16} /> Magical Aptitude Evaluation
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 bg-white/40 p-4 rounded-sm border border-neutral-900/5">
                        <StatBar label="Magical Power" value={data.stats.magic} colorClass="bg-neutral-800" helpText="Raw magical potential and spell intensity." />
                        <StatBar label="Courage" value={data.stats.courage} colorClass="bg-red-800" helpText="Bravery in the face of danger and will to act." />
                        <StatBar label="Intelligence" value={data.stats.intelligence} colorClass="bg-blue-800" helpText="Academic knowledge, logic, and memory." />
                        <StatBar label="Cunning" value={data.stats.cunning} colorClass="bg-green-800" helpText="Resourcefulness, ambition, and tactical thinking." />
                        <StatBar label="Loyalty" value={data.stats.loyalty} colorClass="bg-yellow-600" helpText="Dedication to friends, cause, and duty." />
                    </div>
                    {data.bestSubject && (
                        <div className="mt-3 flex items-center gap-2 bg-neutral-900/5 px-3 py-2 rounded-sm">
                            <GraduationCap className="w-4 h-4 text-neutral-600" />
                            <span className="text-xs font-serif text-neutral-700">
                                <strong>Academic Distinction:</strong> {data.bestSubject}
                            </span>
                        </div>
                    )}
                </section>

                {/* Spells & Abilities */}
                <section>
                    <h4 className={`font-display font-bold text-neutral-800 border-b-2 ${houseBorder} mb-4 pb-1 flex items-center gap-2`}>
                        <Flame size={16} /> Verified Spell Capabilities
                    </h4>
                    <div className="space-y-3">
                        {/* Signature Spell */}
                        {data.signatureSpell && (
                             <div className="bg-gradient-to-r from-amber-100/50 to-transparent border-l-4 border-amber-500 pl-3 py-2">
                                 <div className="text-[9px] uppercase tracking-widest text-amber-700 font-bold mb-0.5">Signature Magic</div>
                                 <div className="font-display font-bold text-lg text-neutral-900">{data.signatureSpell}</div>
                             </div>
                        )}

                        {data.abilities.map((ability, idx) => (
                            <div key={idx} className="bg-white/60 border border-neutral-900/10 p-3 rounded shadow-sm hover:bg-white/90 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        {/* Dynamic Ability Icon */}
                                        <div className="bg-white p-1 rounded-full border border-neutral-200 shadow-sm">
                                            {getAbilityIcon(ability.name, ability.description)}
                                        </div>
                                        <h5 className="font-bold text-neutral-900 font-serif text-lg tracking-tight">{ability.name}</h5>
                                    </div>
                                    <span className="text-[9px] font-mono border border-neutral-300 rounded px-1.5 py-0.5 text-neutral-500 uppercase bg-neutral-50">
                                        Cost: {ability.cost}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-700 leading-snug font-serif pl-9 italic">
                                    {ability.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Traits */}
                <div className="grid grid-cols-2 gap-6 pt-2">
                    <section>
                        <h4 className="font-display font-bold text-green-800 text-xs uppercase tracking-wider mb-2 border-b border-green-800/20 pb-1">
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
                        <h4 className="font-display font-bold text-red-800 text-xs uppercase tracking-wider mb-2 border-b border-red-800/20 pb-1">
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
        <div className="mt-12 pt-8 border-t border-neutral-800/10 flex flex-col md:flex-row justify-between items-end text-[10px] font-mono text-neutral-400 uppercase tracking-wider relative">
             {/* Wax Seal */}
            <div className="absolute bottom-2 right-1/2 translate-x-1/2 md:translate-x-0 md:right-10 w-24 h-24 opacity-90 drop-shadow-md">
                <svg viewBox="0 0 100 100" className="fill-red-800/80">
                    <path d="M50 5 C20 5 5 25 5 55 C5 80 25 95 50 95 C75 95 95 80 95 55 C95 25 80 5 50 5 Z" style={{filter: 'url(#rough)'}} />
                    <circle cx="50" cy="50" r="35" className="fill-transparent stroke-red-900/50 stroke-2" />
                    <text x="50" y="55" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#500" fontFamily="serif">M.O.M.</text>
                    <text x="50" y="75" fontSize="8" textAnchor="middle" fill="#500" fontFamily="monospace">APPROVED</text>
                </svg>
            </div>
            
            <div className="flex flex-col gap-1">
                <span>Generated by The Department of Mysteries</span>
                <span>Magic is Might // Laws of Magic Section 7B</span>
            </div>
            <div className="flex gap-4 z-10">
                <span>Verified by: _____________</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
