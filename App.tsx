import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, FileText, ClipboardPaste, Check, RotateCcw, Trash2, Settings, Moon, Sun, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { TargetLanguage, VoiceName, AppError, VoiceSettings } from './types';
import { createWavBlob } from './utils/audioUtils';
import { getLocalizedError, ErrorKey } from './utils/localization';
import { generateSpeech } from './services/geminiService';
import { STORAGE_KEY } from './constants';
import LanguageSelector from './components/LanguageSelector';
import VoiceSelector from './components/VoiceSelector';
import SettingsSelector from './components/SettingsSelector';
import AudioPlayer from './components/AudioPlayer';
import Button from './components/Button';
import Modal from './components/Modal';

const THEME_KEY = 'ava_theme_mode';

const App: React.FC = () => {
  // Helper to load settings from localStorage
  const getSavedSettings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error loading settings:", e);
      return null;
    }
  };

  const saved = getSavedSettings();

  // State
  const [text, setText] = useState('');
  // Force Persian language for errors regardless of device settings
  const [deviceLang] = useState<TargetLanguage>(TargetLanguage.Fa);
  
  // Settings State
  const [selectedLang, setSelectedLang] = useState<TargetLanguage>(saved?.lang || TargetLanguage.Fa);
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(saved?.voice || VoiceName.Puck);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(
    saved?.settings || { speed: 50, pitch: 50, volume: 75 }
  );
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'about'>('general');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Effect: Auto-save settings
  useEffect(() => {
    const settingsToSave = {
      lang: selectedLang,
      voice: selectedVoice,
      settings: voiceSettings
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (e) {
      console.error("Failed to autosave settings", e);
    }
  }, [selectedLang, selectedVoice, voiceSettings]);

  // Effect: Toggle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const showError = (key: ErrorKey, customMessage?: string) => {
    const msg = customMessage || getLocalizedError(key, deviceLang);
    setError({ message: msg, isError: true });
  };

  const handleFactoryReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSelectedLang(TargetLanguage.Fa);
      setSelectedVoice(VoiceName.Puck);
      setVoiceSettings({ speed: 50, pitch: 50, volume: 75 });
      // Reset theme as well? Optional, let's keep theme preference.
    } catch (e) {
      console.error("Failed to reset settings", e);
    }
    setShowSettingsModal(false);
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      showError('EMPTY_INPUT');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const base64Data = await generateSpeech(text, selectedVoice, selectedLang, voiceSettings);
      const wavBlob = createWavBlob(base64Data);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (err: any) {
      console.error(err);
      showError('GENERIC_ERROR', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/plain") {
         showError('INVALID_FILE');
         return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async () => {
    try {
      // Focus window to ensure the document is active, which is often required for clipboard access
      window.focus();
      
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        throw new Error("Clipboard API unavailable");
      }
      const text = await navigator.clipboard.readText();
      setText(text);
      setError(null);
    } catch (err) {
      console.error("Paste error:", err);
      // Focus the textarea so the user can easily paste manually (Ctrl+V / Long press)
      textareaRef.current?.focus();
      showError('CLIPBOARD_ERROR');
    }
  };

  const handleClear = () => {
    setText('');
    setError(null);
    textareaRef.current?.focus();
  };

  const handleReset = () => {
    setAudioUrl(null);
    setError(null);
  };

  const openSettings = () => {
    setSettingsTab('general');
    setShowSettingsModal(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} pb-20`} dir="rtl">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Sparkles size={18} />
              </div>
              <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">صبا آوا</h1>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">گروه فنی کانال تلگرامی صبارسانه</span>
          </div>
          
          <button 
            onClick={openSettings}
            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-700 rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-8">
        
        {/* Introduction */}
        {!audioUrl && (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">تبدیل متن به صدای طبیعی</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">
              متن خود را وارد کنید، زبان و صدا را انتخاب کنید و فایل صوتی با کیفیت تحویل بگیرید.
            </p>
          </div>
        )}

        {/* Error Modal */}
        <Modal 
          isOpen={!!error} 
          onClose={() => setError(null)} 
          title="خطا در عملیات"
          isError
        >
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
               <AlertCircle size={24} />
             </div>
             <p className="text-gray-700 text-sm leading-relaxed">
               {error?.message}
             </p>
             <button 
               onClick={() => setError(null)}
               className="w-full bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 transition-colors"
             >
               متوجه شدم
             </button>
          </div>
        </Modal>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          title="تنظیمات برنامه"
        >
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6">
              <button
                onClick={() => setSettingsTab('general')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                  settingsTab === 'general'
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Settings size={16} />
                عمومی
              </button>
              <button
                onClick={() => setSettingsTab('about')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                  settingsTab === 'about'
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Info size={16} />
                درباره ما
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {settingsTab === 'general' ? (
                <>
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 dark:text-white">حالت شب</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">تغییر تم ظاهری برنامه</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                      <span 
                        className={`absolute top-1 right-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out transform ${isDarkMode ? '-translate-x-6' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>

                  {/* Factory Reset */}
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <button
                        onClick={handleFactoryReset}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-xl transition-all"
                      >
                        <RotateCcw size={18} />
                        <span>بازگشت به تنظیمات کارخانه</span>
                      </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-5 animate-fade-in">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
                    <Info size={32} />
                  </div>
                  
                  <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-7 text-justify" dir="rtl">
                    <p>
                      این برنامه برای تبدیل متن به صدا با امکانات ویژه‌ای تهیه شده است. تیم فنی کانال تلگرامی <strong>صبا رسانه</strong> که در حوزه انتشار خبر و تحلیل و گفتگو فعالیت دارد، این برنامه را به جامعه محترم کارگران، بازنشستگان و مردم ایران تقدیم می‌کند.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">برای پیوستن به کانال صبا رسانه کلیک کنید:</p>
                    <a 
                      href="https://t.me/saba_rasanehh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg hover:underline dir-ltr"
                    >
                      <span>@saba_rasanehh</span>
                      <ExternalLink size={16} />
                    </a>
                    <a 
                      href="https://t.me/saba_rasanehh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-gray-400 mt-2 font-mono hover:text-blue-500 transition-colors block"
                    >
                      https://t.me/saba_rasanehh
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>

        {audioUrl ? (
          <AudioPlayer audioUrl={audioUrl} onReset={handleReset} />
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">متن ورودی</label>
                <div className="flex gap-2">
                  <button 
                    onClick={handleClear}
                    className="text-xs flex items-center gap-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                    title="پاک کردن متن"
                  >
                    <Trash2 size={14} />
                    پاک کردن
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded-lg transition-colors"
                  >
                    <FileText size={14} />
                    آپلود فایل
                  </button>
                  <button 
                    onClick={handlePaste}
                    className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 py-1 rounded-lg transition-colors"
                  >
                    <ClipboardPaste size={14} />
                    چسباندن
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".txt" 
                  onChange={handleFileUpload}
                />
              </div>
              
              {/* Enhanced Textarea with Graphical Border */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-xl opacity-50 group-hover:opacity-100 transition duration-200 blur-[1px]"></div>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="متن خود را اینجا تایپ کنید یا فایل متنی آپلود نمایید..."
                  className="relative w-full h-48 rounded-xl p-4 text-sm resize-none transition-all
                             bg-white dark:bg-gray-900 
                             text-gray-800 dark:text-gray-100 
                             placeholder-gray-400 dark:placeholder-gray-600
                             border-2 border-indigo-200 dark:border-indigo-800
                             focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500
                             shadow-inner"
                  dir="rtl"
                />
              </div>

              <div className="flex justify-end mt-2">
                <span className={`text-xs ${text.length > 5000 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  {text.length} کاراکتر
                </span>
              </div>
            </div>

            {/* Settings Area */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6 transition-colors">
              <div className="dark:text-white">
                 <LanguageSelector selected={selectedLang} onChange={setSelectedLang} />
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
              <div className="dark:text-white">
                <VoiceSelector selected={selectedVoice} onChange={setSelectedVoice} />
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
              <div className="dark:text-white">
                <SettingsSelector settings={voiceSettings} onChange={setVoiceSettings} />
              </div>
              
              <div className="h-px bg-gray-100 dark:bg-gray-700"></div>
              
              <div className="flex items-center justify-start">
                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                   <Check size={12} />
                   تنظیمات به صورت خودکار ذخیره می‌شوند
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 sticky bottom-6 z-20">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 via-gray-50 dark:via-gray-900 to-transparent -top-10 -z-10 h-[140%] pointer-events-none"></div>
              <Button 
                onClick={handleGenerate} 
                isLoading={isLoading} 
                className="w-full shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40"
                icon={<Sparkles size={20} />}
              >
                تولید فایل صوتی
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;