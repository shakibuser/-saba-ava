export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr',
}

export enum TargetLanguage {
  Fa = 'Persian',
  En = 'English',
  Ar = 'Arabic',
  De = 'German',
  Fr = 'French',
  Es = 'Spanish',
  Tr = 'Turkish'
}

export interface AudioState {
  blob: Blob | null;
  url: string | null;
  isPlaying: boolean;
}

export interface AppError {
  message: string;
  isError: boolean;
}

export interface VoiceSettings {
  speed: number; // 0 (slow) to 100 (fast), default 50
  pitch: number; // 0 (deep) to 100 (high), default 50
  volume: number; // 0 (soft) to 100 (loud), default 75
}