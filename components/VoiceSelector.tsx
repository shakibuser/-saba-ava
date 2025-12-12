import React from 'react';
import { Mic2, User } from 'lucide-react';
import { VOICE_OPTIONS } from '../constants';
import { VoiceName } from '../types';

interface VoiceSelectorProps {
  selected: VoiceName;
  onChange: (voice: VoiceName) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 transition-colors duration-300">
        <Mic2 size={18} className="text-indigo-500 dark:text-indigo-400" />
        انتخاب نوع صدا
      </label>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 pt-2">
        {VOICE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border-2 min-w-[100px] transition-all duration-300 ease-out
              ${selected === option.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 transform scale-105 z-10' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
            `}
          >
            <div className={`p-2 rounded-full mb-2 transition-colors duration-300 ${selected === option.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <User size={20} className={selected === option.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
            </div>
            <span className="text-xs font-bold">{option.label}</span>
            <span className={`text-[10px] opacity-80 ${selected === option.id ? 'text-indigo-100' : 'text-gray-400 dark:text-gray-500'}`}>
              {option.gender === 'Male' ? 'مرد' : 'زن'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector;