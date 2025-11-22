import React from 'react';
import { CardData, House } from '../types';
import { Swords, Shield, Sparkles } from 'lucide-react';

interface CardProps {
  data: CardData;
  imageUrl: string | null;
  isLoadingImage: boolean;
}

// Design configuration per house
const HouseStyles: Record<House, { 
  bgGradient: string, 
  border: string, 
  iconColor: string, 
  texture: string,
  headerColor: string,
  textColor: string
}> = {
  [House.Gryffindor]: {
    bgGradient: 'from-red-900 via-red-800 to-red-950',
    border: 'border-[#C09D54]', // Gold
    iconColor: 'text-yellow-500',
    texture: 'bg-red-950',
    headerColor: 'bg-[#7F1D1D]',
    textColor: 'text-white'
  },
  [House.Slytherin]: {
    bgGradient: 'from-green-900 via-green-800 to-green-950',
    border: 'border-[#C0C0C0]', // Silver
    iconColor: 'text-green-400',
    texture: 'bg-green-950',
    headerColor: 'bg-[#14532D]',
    textColor: 'text-white'
  },
  [House.Ravenclaw]: {
    bgGradient: 'from-blue-900 via-blue-800 to-slate-900',
    border: 'border-[#CD7F32]', // Bronze
    iconColor: 'text-blue-300',
    texture: 'bg-slate-950',
    headerColor: 'bg-[#1E3A8A]',
    textColor: 'text-white'
  },
  [House.Hufflepuff]: {
    bgGradient: 'from-yellow-900 via-yellow-800 to-amber-950',
    border: 'border-[#2a2a2a]', // Dark Grey/Black
    iconColor: 'text-yellow-400',
    texture: 'bg-yellow-950',
    headerColor: 'bg-[#713F12]',
    textColor: 'text-white'
  },
  [House.Neutral]: {
    bgGradient: 'from-neutral-800 via-neutral-700 to-neutral-900',
    border: 'border-[#A3A3A3]',
    iconColor: 'text-white',
    texture: 'bg-neutral-800',
    headerColor: 'bg-[#404040]',
    textColor: 'text-white'
  }
};

const CostBadge: React.FC<{ cost: string }> = ({ cost }) => {
  // Parse simplistic mana cost string
  const symbols = cost.match(/(\d+|[A-Z])/g) || [];
  
  const getColor = (char: string) => {
    switch(char) {
      case 'R': return 'bg-red-700 border-red-500'; // Gryffindor
      case 'S': 
      case 'G': return 'bg-green-700 border-green-500'; // Slytherin
      case 'B': 
      case 'U': return 'bg-blue-700 border-blue-500'; // Ravenclaw
      case 'H': return 'bg-yellow-500 text-black border-yellow-300'; // Hufflepuff
      case 'D': return 'bg-gray-900 border-purple-900'; // Dark Arts
      case 'W': return 'bg-amber-100 text-black border-white'; // White/Light
      default: return 'bg-neutral-600 border-neutral-400';
    }
  };

  return (
    <div className="flex gap-0.5 items-center shadow-sm">
      {symbols.map((sym, i) => (
        <div 
          key={i} 
          className={`
            w-5 h-5 rounded-full flex items-center justify-center 
            text-[10px] font-bold border shadow-inner
            ${/\d/.test(sym) ? 'bg-neutral-300 text-black border-neutral-400' : `${getColor(sym)} text-white`}
          `}
        >
          {sym === 'U' ? 'B' : sym}
        </div>
      ))}
    </div>
  );
};

export const Card: React.FC<CardProps> = ({ data, imageUrl, isLoadingImage }) => {
  const style = HouseStyles[data.house] || HouseStyles.Neutral;

  return (
    <div className="group perspective-1000 select-none">
      <div className={`
        relative w-[380px] h-[540px] rounded-[20px] p-3
        bg-gradient-to-br ${style.bgGradient}
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)]
        border-[8px] ${style.border}
        transition-transform duration-300 group-hover:scale-[1.02] group-hover:-rotate-1
      `}>
        
        {/* Inner Frame */}
        <div className="relative w-full h-full flex flex-col bg-black/20 rounded-lg overflow-hidden border border-white/10">
          
          {/* Header */}
          <div className={`h-9 ${style.headerColor} border-b border-black/30 flex items-center justify-between px-3 shadow-md z-10 relative`}>
            <h2 className={`font-display font-bold text-base ${style.textColor} tracking-wide shadow-black drop-shadow-md`}>
              {data.name}
            </h2>
            {/* Mana Cost / Power Level approximation using Magic Stat */}
            <div className="flex items-center gap-1">
               {data.rarity === 'Mythic' && <Sparkles className="w-4 h-4 text-amber-300 animate-pulse filter drop-shadow-lg" />}
            </div>
          </div>

          {/* Image Area */}
          <div className="relative w-full h-[250px] bg-[#0a0a0a] border-y-[2px] border-[#2a2a2a] shadow-inner group overflow-hidden">
             {isLoadingImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-neutral-500 gap-2">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                 <span className="font-serif text-xs italic opacity-60">Divining visual form...</span>
              </div>
            ) : imageUrl ? (
              <>
                <img src={imageUrl} alt={data.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {/* Texture overlay on image for canvas feel */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/canvas.png')]"></div>
              </>
            ) : (
               <div className="absolute inset-0 bg-neutral-800" />
            )}
            
            {/* Rarity Symbol */}
            <div className={`
              absolute right-2 bottom-2 px-2 py-0.5 rounded-full 
              flex items-center justify-center text-[9px] uppercase font-bold tracking-widest
              border backdrop-blur-md shadow-lg
              ${data.rarity === 'Mythic' ? 'bg-orange-600/90 text-white border-orange-400' : 
                data.rarity === 'Rare' ? 'bg-yellow-500/90 text-black border-yellow-300' : 
                data.rarity === 'Uncommon' ? 'bg-slate-400/90 text-black border-slate-300' : 
                'bg-neutral-800/90 text-white border-neutral-600'}
            `}>
              {data.rarity}
            </div>
          </div>

          {/* Type Line */}
          <div className={`h-7 bg-neutral-200/95 border-b border-black/20 flex items-center px-3 z-10 relative shadow-sm`}>
            <span className="text-xs font-bold text-black font-display uppercase tracking-wider truncate max-w-[200px]">
              {data.type} {data.subType ? `— ${data.subType}` : ''}
            </span>
            <div className="ml-auto">
               <span className={`text-[10px] font-bold text-neutral-600 opacity-70`}>
                  Set: {data.house.substring(0,3).toUpperCase()}
               </span>
            </div>
          </div>

          {/* Text Box */}
          <div className="flex-grow bg-[#e8e4da] relative overflow-hidden p-3 texture-paper">
             {/* Watermark Icon */}
             <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <div className="w-24 h-24 bg-current rounded-full"></div> 
             </div>

             {/* Abilities */}
             <div className="space-y-3 mb-2 min-h-[100px] relative z-10">
                {data.abilities.map((ability, idx) => (
                  <div key={idx} className="text-sm text-neutral-900 leading-snug">
                    <div className="flex items-center gap-2 mb-0.5">
                      <CostBadge cost={ability.cost} />
                      <span className="font-bold font-serif text-neutral-900">{ability.name}</span>
                    </div>
                    <p className="text-[11px] text-neutral-800 font-serif pl-1 border-l-2 border-neutral-400/50 ml-0.5">
                      {ability.description}
                    </p>
                  </div>
                ))}
             </div>

             {/* Flavor Text */}
             <div className="mt-auto pt-2 border-t border-neutral-500/30 relative z-10">
               <p className="text-[10px] italic text-neutral-700 font-serif text-center leading-snug px-2">
                 "{data.flavorText}"
               </p>
             </div>
          </div>

          {/* Footer / Stats */}
          <div className={`h-8 ${style.headerColor} flex items-center justify-between px-3 border-t border-white/10 relative z-10`}>
              <div className="text-[9px] text-white/50 font-mono flex flex-col leading-none">
                <span>{data.house.toUpperCase()}</span> 
                <span>No. {Math.floor(Math.random() * 300)}/300</span>
              </div>
              
              {/* Power / Toughness Box */}
              <div className="flex bg-neutral-900 border-2 border-neutral-600 rounded-lg px-3 py-1 -mt-6 shadow-xl z-20 items-center gap-3 transform translate-y-1">
                 <div className="flex items-center gap-1 text-yellow-500">
                    <Swords size={14} />
                    <span className="font-bold text-white text-base font-display">{Math.floor(data.stats.magic / 10)}</span>
                 </div>
                 <div className="w-px h-4 bg-white/20"></div>
                 <div className="flex items-center gap-1 text-blue-400">
                    <Shield size={14} />
                    <span className="font-bold text-white text-base font-display">{data.hp}</span>
                 </div>
              </div>
          </div>

        </div>

        {/* Holographic Overlay */}
        <div className="absolute inset-0 rounded-[14px] foil-overlay pointer-events-none z-50 opacity-25 mix-blend-color-dodge"></div>
        <div className="absolute inset-0 rounded-[14px] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-40"></div>
      </div>
    </div>
  );
};