import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName, TargetLanguage, VoiceSettings } from "../types";

export const generateSpeech = async (
  text: string,
  voice: VoiceName,
  language: TargetLanguage,
  settings: VoiceSettings
): Promise<string> => {
  
  // Use Vite's standard way to access environment variables
  const API_KEY = import.meta.env.VITE_API_KEY;

  if (!API_KEY) {
    throw new Error("کلید API یافت نشد. لطفا در تنظیمات Vercel نام متغیر را به VITE_API_KEY تغییر دهید.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // ---------------------------------------------------------
  // Step 1: Translation (using Text Model)
  // We use the standard flash model for logic/translation to avoid
  // confusing the specialized TTS model.
  // ---------------------------------------------------------
  
  let translatedText = text;

  try {
    const translationPrompt = `
      You are a professional translator.
      Task: Translate the following text into ${language}.
      Rules:
      1. If the text is already in ${language}, return it exactly as is.
      2. Return ONLY the translated text. Do NOT wrap in quotes.
      3. Maintain the original meaning.
      
      Input Text:
      "${text}"
    `;

    const translationResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: translationPrompt }] }],
    });

    if (translationResponse.text) {
      translatedText = translationResponse.text.trim();
    }
  } catch (e) {
    console.warn("Translation failed, proceeding with original text:", e);
    translatedText = text;
  }

  if (!translatedText || translatedText.length === 0) {
    throw new Error("متن پس از پردازش خالی است. لطفا ورودی خود را بررسی کنید.");
  }

  // ---------------------------------------------------------
  // Step 2: Text-to-Speech (using TTS Model)
  // Fix for 500 Error: Removed systemInstruction.
  // We embed style instructions directly into the prompt text.
  // ---------------------------------------------------------

  let styleAdjectives = [];
  
  // Speed
  if (settings.speed < 30) styleAdjectives.push("very slowly");
  else if (settings.speed < 45) styleAdjectives.push("slowly");
  else if (settings.speed > 75) styleAdjectives.push("very quickly");
  else if (settings.speed > 60) styleAdjectives.push("quickly");

  // Pitch/Tone
  if (settings.pitch < 30) styleAdjectives.push("with a deep voice");
  else if (settings.pitch > 70) styleAdjectives.push("with a high-pitched voice");

  // Volume
  if (settings.volume < 30) styleAdjectives.push("softly");
  else if (settings.volume > 80) styleAdjectives.push("loudly");

  const stylePrefix = styleAdjectives.length > 0 
    ? `Speak ${styleAdjectives.join(' and ')}.` 
    : "Speak naturally.";

  // Simplified Prompt Structure to avoid Internal Errors
  const ttsPrompt = `${stylePrefix} Read the following text: ${translatedText}`;

  const ttsResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: ttsPrompt }] }],
    config: {
      // NOTE: Removed systemInstruction as it causes instability (500 errors) in the TTS model
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice,
          },
        },
      },
    },
  });

  const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error("مدل تبدیل متن به گفتار خروجی صوتی تولید نکرد. لطفا مجدد تلاش کنید.");
  }

  return base64Audio;
};
