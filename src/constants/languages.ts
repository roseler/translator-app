import { Language } from '../types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'US English', flag: '🇺🇸' },
  { code: 'fil', name: 'PH Filipino', flag: '🇵🇭' },
  { code: 'es', name: 'ES Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'FR French', flag: '🇫🇷' },
  { code: 'de', name: 'DE German', flag: '🇩🇪' },
  { code: 'it', name: 'IT Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'PT Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'CN Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'JP Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'KR Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'SA Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'RU Russian', flag: '🇷🇺' },
  { code: 'hi', name: 'IN Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'NL Dutch', flag: '🇳🇱' },
  { code: 'pl', name: 'PL Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'TR Turkish', flag: '🇹🇷' },
  { code: 'vi', name: 'VN Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'TH Thai', flag: '🇹🇭' },
  { code: 'sv', name: 'SE Swedish', flag: '🇸🇪' },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return LANGUAGES.find(lang => lang.code === code);
};

