import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  colorClass: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, colorClass }) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs uppercase tracking-wider mb-1 text-neutral-400 font-bold">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
