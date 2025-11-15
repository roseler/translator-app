export interface Language {
  code: string;
  name: string;
  flag?: string;
}

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: number;
}

export interface QuickPhrase {
  english: string;
  translation: string;
  language: string;
  transliteration?: string;
}

