import axios from 'axios';
import { getQuickPhrases } from '../constants/quickPhrases';
import { hasNonLatinCharacters, getTransliteration } from '../utils/transliteration';

// Free Google Translate API endpoint (no API key required for basic usage)
const TRANSLATE_API_URL = 'https://translate.googleapis.com/translate_a/single';

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  transliteration?: string;
}

export const translateText = async (
  text: string,
  fromLang: string,
  toLang: string,
  offlineMode: boolean = false
): Promise<TranslationResult> => {
  // Check offline quick phrases first
  if (offlineMode) {
    const quickPhrases = getQuickPhrases(toLang);
    const phrase = quickPhrases.find(
      p => p.english.toLowerCase() === text.toLowerCase().trim()
    );
    if (phrase) {
      return { 
        translatedText: phrase.translation,
        transliteration: phrase.transliteration,
      };
    }
  }

  try {
    // Use Google Translate API - build URL manually to support multiple dt params
    const baseUrl = `${TRANSLATE_API_URL}?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;
    const response = await axios.get(baseUrl);

    if (response.data && response.data[0] && response.data[0][0]) {
      const translatedText = response.data[0][0][0];
      let transliteration: string | null = null;

      // Try to get transliteration from response
      // Structure: response.data[0][0][3] or response.data[1]
      if (response.data[0][0][3]) {
        transliteration = response.data[0][0][3];
      } else if (response.data[1] && response.data[1][0] && response.data[1][0][0]) {
        transliteration = response.data[1][0][0];
      } else if (hasNonLatinCharacters(translatedText)) {
        // If transliteration not in response, try fetching separately
        try {
          transliteration = await getTransliteration(translatedText, toLang);
        } catch (e) {
          // Ignore transliteration errors
          console.log('Transliteration fetch failed:', e);
        }
      }

      return {
        translatedText,
        detectedLanguage: response.data[2] || fromLang,
        transliteration: transliteration || undefined,
      };
    }

    throw new Error('Translation failed: Invalid response format');
  } catch (error: any) {
    console.error('Translation error:', error);
    
    // Check if it's a network error or API error
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    
    // Fallback to offline phrases if online translation fails
    if (!offlineMode) {
      const quickPhrases = getQuickPhrases(toLang);
      const phrase = quickPhrases.find(
        p => p.english.toLowerCase() === text.toLowerCase().trim()
      );
      if (phrase) {
        return { 
          translatedText: phrase.translation,
          transliteration: phrase.transliteration,
        };
      }
    }
    
    throw new Error(`Translation service unavailable: ${errorMessage}. Please try again or use offline mode.`);
  }
};

