import { QuickPhrase } from '../types';

export { QuickPhrase };

export const QUICK_PHRASES: Record<string, QuickPhrase[]> = {
  fil: [
    { english: 'hello', translation: 'kamusta', language: 'fil' },
    { english: 'hi', translation: 'kamusta', language: 'fil' },
    { english: 'goodbye', translation: 'paalam', language: 'fil' },
    { english: 'bye', translation: 'paalam', language: 'fil' },
    { english: 'thank you', translation: 'salamat', language: 'fil' },
    { english: 'thanks', translation: 'salamat', language: 'fil' },
    { english: 'please', translation: 'pakiusap', language: 'fil' },
    { english: 'yes', translation: 'oo', language: 'fil' },
    { english: 'no', translation: 'hindi', language: 'fil' },
    { english: 'how are you?', translation: 'kumusta ka?', language: 'fil' },
    { english: 'excuse me', translation: 'paumanhin', language: 'fil' },
  ],
  vi: [
    { english: 'hello', translation: 'xin chào', language: 'vi', transliteration: 'sin chow' },
    { english: 'goodbye', translation: 'tạm biệt', language: 'vi', transliteration: 'tam biet' },
    { english: 'thank you', translation: 'cảm ơn', language: 'vi', transliteration: 'kam uhn' },
    { english: 'please', translation: 'xin vui lòng', language: 'vi', transliteration: 'sin vui long' },
    { english: 'yes', translation: 'có', language: 'vi', transliteration: 'koh' },
    { english: 'no', translation: 'không', language: 'vi', transliteration: 'khom' },
    { english: 'how are you?', translation: 'bạn khỏe không?', language: 'vi', transliteration: 'ban khoe khom?' },
  ],
  th: [
    { english: 'hello', translation: 'สวัสดี', language: 'th', transliteration: 'sawatdi' },
    { english: 'goodbye', translation: 'ลาก่อน', language: 'th', transliteration: 'la kon' },
    { english: 'thank you', translation: 'ขอบคุณ', language: 'th', transliteration: 'khob khun' },
    { english: 'please', translation: 'กรุณา', language: 'th', transliteration: 'karuna' },
    { english: 'yes', translation: 'ใช่', language: 'th', transliteration: 'chai' },
    { english: 'no', translation: 'ไม่', language: 'th', transliteration: 'mai' },
  ],
};

export const getQuickPhrases = (languageCode: string): QuickPhrase[] => {
  return QUICK_PHRASES[languageCode] || [];
};

