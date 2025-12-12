import React from 'react';
import { Sliders, Gauge, Activity, Volume2 } from 'lucide-react';
import { VoiceSettings } from '../types';

interface SettingsSelectorProps {
  settings: VoiceSettings;
  onChange: (settings: VoiceSettings) => void;
}

const SettingsSelector: React.FC<SettingsSelectorProps> = ({ settings, onChange }) => {
  const handleChange = (key: keyof VoiceSettings, value: number) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2 transition-colors duration-300">
        <Sliders size={18} className="text-indigo-500 dark:text-indigo-400" />
        تنظیمات پیشرفته صدا
      </label>
      
      <div className="space-y-6 px-2">
        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Gauge size={14} /> سرعت گفتار</span>
            <span>{settings.speed < 40 ? 'آهسته' : settings.speed > 60 ? 'سریع' : 'معمولی'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.speed}
            onChange={(e) => handleChange('speed', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
            <span>کند</span>
            <span>تند</span>
          </div>
        </div>

        {/* Pitch Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Activity size={14} /> تـن صدا</span>
            <span>{settings.pitch < 40 ? 'بم (عمیق)' : settings.pitch > 60 ? 'زیر (کودکانه)' : 'طبیعی'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.pitch}
            onChange={(e) => handleChange('pitch', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
            <span>بم</span>
            <span>زیر</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Volume2 size={14} /> بلندی صدا</span>
            <span>{settings.volume < 40 ? 'آرام' : settings.volume > 80 ? 'خیلی بلند' : 'استاندارد'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.volume}
            onChange={(e) => handleChange('volume', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsSelector;