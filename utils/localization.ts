import { TargetLanguage } from "../types";

export type ErrorKey = 'EMPTY_INPUT' | 'INVALID_FILE' | 'CLIPBOARD_ERROR' | 'GENERIC_ERROR' | 'SAVE_ERROR';

const ERROR_MESSAGES: Record<TargetLanguage, Record<ErrorKey, string>> = {
  [TargetLanguage.Fa]: {
    EMPTY_INPUT: 'لطفا متنی را وارد کنید یا فایلی را آپلود نمایید.',
    INVALID_FILE: 'فقط فایل‌های متنی (txt) پشتیبانی می‌شوند.',
    CLIPBOARD_ERROR: 'دسترسی خودکار مسدود شد. لطفا متن را دستی (Paste) کنید.',
    GENERIC_ERROR: 'خطایی رخ داد. لطفا مجدد تلاش کنید.',
    SAVE_ERROR: 'خطا در ذخیره‌سازی تنظیمات.'
  },
  [TargetLanguage.En]: {
    EMPTY_INPUT: 'Please enter text or upload a file.',
    INVALID_FILE: 'Only text files (.txt) are supported.',
    CLIPBOARD_ERROR: 'Clipboard access denied. Please paste manually.',
    GENERIC_ERROR: 'An error occurred. Please try again.',
    SAVE_ERROR: 'Error saving settings.'
  },
  [TargetLanguage.Ar]: {
    EMPTY_INPUT: 'الرجاء إدخال نص أو تحميل ملف.',
    INVALID_FILE: 'يتم دعم الملفات النصية فقط (.txt).',
    CLIPBOARD_ERROR: 'تم رفض الوصول للحافظة. يرجى اللصق يدوياً.',
    GENERIC_ERROR: 'حدث خطأ. حاول مرة اخرى.',
    SAVE_ERROR: 'خطأ في حفظ الإعدادات.'
  },
  [TargetLanguage.De]: {
    EMPTY_INPUT: 'Bitte geben Sie Text ein oder laden Sie eine Datei hoch.',
    INVALID_FILE: 'Nur Textdateien (.txt) werden unterstützt.',
    CLIPBOARD_ERROR: 'Zwischenablage verweigert. Bitte manuell einfügen.',
    GENERIC_ERROR: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    SAVE_ERROR: 'Fehler beim Speichern der Einstellungen.'
  },
  [TargetLanguage.Fr]: {
    EMPTY_INPUT: 'Veuillez saisir du texte ou télécharger un fichier.',
    INVALID_FILE: 'Seuls les fichiers texte (.txt) sont supportés.',
    CLIPBOARD_ERROR: 'Accès presse-papiers refusé. Collez manuellement.',
    GENERIC_ERROR: 'Une erreur s\'est produite. Veuillez réessayer.',
    SAVE_ERROR: 'Erreur lors de l\'enregistrement des paramètres.'
  },
  [TargetLanguage.Es]: {
    EMPTY_INPUT: 'Por favor ingrese texto o cargue un archivo.',
    INVALID_FILE: 'Solo se admiten archivos de texto (.txt).',
    CLIPBOARD_ERROR: 'Acceso al portapapeles denegado. Pegue manualmente.',
    GENERIC_ERROR: 'Ocurrió un error. Intentar de nuevo.',
    SAVE_ERROR: 'Error al guardar la configuración.'
  },
  [TargetLanguage.Tr]: {
    EMPTY_INPUT: 'Lütfen metin girin veya bir dosya yükleyin.',
    INVALID_FILE: 'Yalnızca metin dosyaları (.txt) desteklenir.',
    CLIPBOARD_ERROR: 'Pano erişimi reddedildi. Lütfen manuel yapıştırın.',
    GENERIC_ERROR: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    SAVE_ERROR: 'Ayarlar kaydedilirken hata oluştu.'
  }
};

export const detectDeviceLanguage = (): TargetLanguage => {
  const lang = navigator.language.split('-')[0].toLowerCase();
  switch (lang) {
    case 'fa': return TargetLanguage.Fa;
    case 'en': return TargetLanguage.En;
    case 'ar': return TargetLanguage.Ar;
    case 'de': return TargetLanguage.De;
    case 'fr': return TargetLanguage.Fr;
    case 'es': return TargetLanguage.Es;
    case 'tr': return TargetLanguage.Tr;
    default: return TargetLanguage.Fa; // Fallback to Persian (or change to En if preferred)
  }
};

export const getLocalizedError = (key: ErrorKey, lang: TargetLanguage): string => {
  return ERROR_MESSAGES[lang]?.[key] || ERROR_MESSAGES[TargetLanguage.Fa][key];
};

export const getLanguageLabel = (lang: TargetLanguage): string => {
  const labels: Record<TargetLanguage, string> = {
    [TargetLanguage.Fa]: 'فارسی (Persian)',
    [TargetLanguage.En]: 'English',
    [TargetLanguage.Ar]: 'العربية (Arabic)',
    [TargetLanguage.De]: 'Deutsch (German)',
    [TargetLanguage.Fr]: 'Français (French)',
    [TargetLanguage.Es]: 'Español (Spanish)',
    [TargetLanguage.Tr]: 'Türkçe (Turkish)'
  };
  return labels[lang] || lang;
};