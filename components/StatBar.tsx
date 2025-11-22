import React from 'react';
import { HelpCircle } from 'lucide-react';

interface StatBarProps {
  label: string;
  value: number;
  colorClass: string;
  helpText?: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, colorClass, helpText }) => {
  return (
    <div className="mb-3 group">
      <div className="flex justify-between text-xs uppercase tracking-wider mb-1 text-neutral-600 font-bold items-center">
        <div className="flex items-center gap-1.5 cursor-help" title={helpText}>
            <span>{label}</span>
            {helpText && <HelpCircle className="w-3 h-3 text-neutral-400 opacity-50 group-hover:opacity-100 transition-opacity" />}
        </div>
        <span>{value}/100</span>
      </div>
      <div className="h-2 bg-neutral-300 rounded-full overflow-hidden border border-neutral-300">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};