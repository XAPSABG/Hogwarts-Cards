import React from 'react';
import { CardData, House } from '../types';
import { StatBar } from './StatBar';
import { Wand2, Shield, Fingerprint, Skull, Briefcase, ScrollText, Stamp } from 'lucide-react';

interface ProfileProps {
  data: CardData;
}

const HouseColorMap: Record<House, string> = {
  [House.Gryffindor]: 'bg-red-700',
  [House.Slytherin]: 'bg-green-700',
  [House.Ravenclaw]: 'bg-blue-700',
  [House.Hufflepuff]: 'bg-yellow-600',
  [House.Neutral]: 'bg-neutral-600',
};

const HouseCrest: Record<House, string> = {
    [House.Gryffindor]: "🦁",
    [House.Slytherin]: "🐍",
    [House.Ravenclaw]: "🦅",
    [House.Hufflepuff]: "🦡",
    [House.Neutral]: "⚖️"
};

export const Profile: React.FC<ProfileProps> = ({ data }) => {
  const barColor = HouseColorMap[data.house];

  return (
    <div className="relative w-full max-w-2xl perspective-1000 animate-in fade-in slide-in-from-right-8 duration-700">
      {/* Folder Tab */}
      <div className="absolute -top-8 left-0 w-48 h-10 bg-[#d4c5a3] rounded-t-lg border-t border-l border-r border-[#b0a080] shadow-inner flex items-center px-4">
        <span className="font-mono text-xs text-neutral-700 font-bold uppercase tracking-widest">Confidential // {new Date().getFullYear()}</span>
      </div>

      {/* Main File Container */}
      <div className="bg-[#f0e6d2] texture-paper text-neutral-800 rounded-tr-lg rounded-b-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-8 border border-[#d4c5a3] relative overflow-hidden">
        
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-[0.03] pointer-events-none select-none filter grayscale rotate-12 scale-150">
            {HouseCrest[data.house]}
        </div>

        {/* Stamps */}
        <div className="absolute top-8 right-8 border-4 border-red-800/40 text-red-900/40 rounded p-2 transform rotate-12 font-display font-bold text-xl uppercase tracking-widest select-none pointer-events-none mix-blend-multiply">
            Ministry Approved
        </div>

        {/* Header */}
        <div className="border-b-2 border-neutral-800/10 pb-6 mb-6 flex justify-between items-end relative z-10">
            <div>
                <h6 className="text-xs font-mono text-neutral-500 uppercase mb-1">Subject Profile</h6>
                <h1 className="text-4xl font-display font-bold text-neutral-900 tracking-tight">{data.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded text-white text-xs font-bold uppercase tracking-wide shadow-sm ${barColor}`}>
                        {data.house}
                    </span>
                    <span className="text-neutral-500 text-sm italic font-serif">— {data.type}</span>
                </div>
            </div>
            <div className="text-5xl opacity-80 filter drop-shadow-sm transform -translate-y-2">
                {HouseCrest[data.house]}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            
            {/* Left Column: Stats & Equipment */}
            <div className="space-y-6">
                <section>
                    <h4 className="font-display font-bold text-neutral-700 border-b border-neutral-300 mb-3 pb-1 flex items-center gap-2">
                        <Fingerprint size={16} /> Magical Aptitude
                    </h4>
                    <div className="space-y-3 pr-2">
                        <StatBar label="Magic" value={data.stats.magic} colorClass={barColor} />
                        <StatBar label="Courage" value={data.stats.courage} colorClass={barColor} />
                        <StatBar label="Intellect" value={data.stats.intelligence} colorClass={barColor} />
                        <StatBar label="Cunning" value={data.stats.cunning} colorClass={barColor} />
                        <StatBar label="Loyalty" value={data.stats.loyalty} colorClass={barColor} />
                    </div>
                </section>

                <section>
                    <h4 className="font-display font-bold text-neutral-700 border-b border-neutral-300 mb-3 pb-1 flex items-center gap-2">
                        <Briefcase size={16} /> Equipment & Artifacts
                    </h4>
                    <ul className="bg-white/40 border border-white/50 rounded p-3 space-y-2 text-sm font-serif shadow-sm">
                        {data.wand && (
                             <li className="flex items-start gap-2">
                                <Wand2 className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                                <span className="text-neutral-800"><span className="font-bold">Wand:</span> {data.wand}</span>
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
                            <li className="text-neutral-400 italic">No notable equipment listed.</li>
                        )}
                    </ul>
                </section>
            </div>

            {/* Right Column: Bio & Traits */}
            <div className="space-y-6">
                <section>
                    <h4 className="font-display font-bold text-neutral-700 border-b border-neutral-300 mb-3 pb-1 flex items-center gap-2">
                        <Stamp size={16} /> Biography
                    </h4>
                    <p className="text-sm font-serif leading-relaxed text-neutral-800 text-justify">
                        {data.biography}
                    </p>
                </section>

                {data.patronus && (
                    <div className="bg-blue-50/60 border border-blue-200 p-3 rounded flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            <Shield className="text-blue-500 w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Corporeal Patronus</div>
                            <div className="text-sm font-bold text-neutral-700">{data.patronus}</div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <section>
                        <h4 className="font-display font-bold text-green-800 border-b border-green-800/20 mb-2 pb-1 text-sm flex items-center gap-2">
                             Strengths
                        </h4>
                        <ul className="text-sm font-serif space-y-2 text-neutral-700">
                            {data.strengths?.map((s, i) => (
                                <li key={i} className="flex items-start gap-1.5 leading-tight">
                                    <span className="text-green-600 mt-1.5 w-1 h-1 rounded-full bg-green-600 flex-shrink-0"></span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h4 className="font-display font-bold text-red-800 border-b border-red-800/20 mb-2 pb-1 text-sm flex items-center gap-2">
                            <Skull size={14} /> Weaknesses
                        </h4>
                        <ul className="text-sm font-serif space-y-2 text-neutral-700">
                            {data.weaknesses?.map((w, i) => (
                                <li key={i} className="flex items-start gap-1.5 leading-tight">
                                    <span className="text-red-600 mt-1.5 w-1 h-1 rounded-full bg-red-600 flex-shrink-0"></span>
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>

        {/* Footer Code */}
        <div className="mt-8 pt-4 border-t border-neutral-800/10 flex justify-between text-[10px] font-mono text-neutral-400">
            <span>FILE: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            <span>MINISTRY OF MAGIC • DEPT OF MYSTERIES</span>
        </div>
      </div>
    </div>
  );
};