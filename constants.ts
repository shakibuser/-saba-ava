import { TargetLanguage, VoiceName } from "./types";
import { Mic, User, Anchor, Zap, Star } from 'lucide-react'; // Just utilizing icons in UI, not in this specific file, keeping pure data here.

export const STORAGE_KEY = 'ava_app_settings';

export const VOICE_OPTIONS = [
  { id: VoiceName.Puck, label: 'صدای ۱ (خنثی)', gender: 'Male' },
  { id: VoiceName.Charon, label: 'صدای ۲ (عمیق)', gender: 'Male' },
  { id: VoiceName.Kore, label: 'صدای ۳ (آرام)', gender: 'Female' },
  { id: VoiceName.Fenrir, label: 'صدای ۴ (قوی)', gender: 'Male' },
  { id: VoiceName.Zephyr, label: 'صدای ۵ (نرم)', gender: 'Female' },
];

export const LANGUAGE_OPTIONS = [
  { id: TargetLanguage.Fa, label: 'فارسی' },
  { id: TargetLanguage.En, label: 'انگلیسی' },
  { id: TargetLanguage.Ar, label: 'عربی' },
  { id: TargetLanguage.Tr, label: 'ترکی' },
  { id: TargetLanguage.De, label: 'آلمانی' },
  { id: TargetLanguage.Fr, label: 'فرانسوی' },
];

export const SAMPLE_RATE = 24000;