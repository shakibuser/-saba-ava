import React, { useRef, useEffect } from 'react';
import { Download, Play, Pause, RefreshCw } from 'lucide-react';
import Button from './Button';

interface AudioPlayerProps {
  audioUrl: string;
  onReset: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onReset }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
      setDuration(total);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 animate-fade-in-up">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">فایل آماده پخش</h3>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">تولید موفق</span>
      </div>

      {/* Visualizer Placeholder / Progress Bar */}
      <div className="relative w-full h-12 bg-gray-100 rounded-xl mb-6 overflow-hidden flex items-center px-4 cursor-pointer group"
           onClick={(e) => {
             if (!audioRef.current) return;
             const rect = e.currentTarget.getBoundingClientRect();
             const x = e.clientX - rect.left; // x position within the element.
             const percentage = x / rect.width;
             audioRef.current.currentTime = percentage * audioRef.current.duration;
           }}>
        {/* Simple Waveform Bars Simulation */}
        <div className="absolute inset-0 flex items-center justify-around px-2 opacity-20">
          {[...Array(40)].map((_, i) => (
             <div key={i} className="w-1 bg-indigo-500 rounded-full" style={{ height: `${20 + Math.random() * 60}%` }}></div>
          ))}
        </div>
        
        {/* Progress Overlay */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-indigo-500/20 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>

        <div className="absolute inset-0 flex justify-between items-center px-4 text-xs font-mono font-medium text-gray-500 pointer-events-none">
           <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
           <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={togglePlay}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-200 transition-all"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          {isPlaying ? 'توقف' : 'پخش کنید'}
        </button>

        <a
          href={audioUrl}
          download="ava-speech.wav"
          className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all"
        >
          <Download size={20} />
          دانلود
        </a>

        <button
          onClick={onReset}
          className="px-4 py-3 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500 rounded-2xl transition-colors"
          title="شروع مجدد"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;