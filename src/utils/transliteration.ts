/**
 * Check if text contains non-Latin characters (CJK, Arabic, Thai, Hindi, Cyrillic, etc.)
 */
export const hasNonLatinCharacters = (text: string): boolean => {
  // Match non-Latin scripts: CJK, Arabic, Thai, Hindi, Cyrillic, Hebrew, etc.
  const nonLatinRegex = /[\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\u4E00-\u9FFF\u3400-\u4DBF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u0E00-\u0E7F\u0900-\u097F\u0400-\u04FF\u0590-\u05FF]/;
  return nonLatinRegex.test(text);
};

/**
 * Get transliteration for text using Google Translate API
 */
export const getTransliteration = async (
  text: string,
  languageCode: string
): Promise<string | null> => {
  try {
    // Languages that commonly need transliteration
    const transliterationLanguages = ['th', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru', 'he'];
    
    if (!transliterationLanguages.includes(languageCode) || !hasNonLatinCharacters(text)) {
      return null;
    }

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${languageCode}&tl=en&dt=rm&q=${encodeURIComponent(text)}`
    );
    
    const data = await response.json();
    
    // The transliteration is typically in data[0][0][3] or similar structure
    if (data && data[0] && data[0][0] && data[0][0][3]) {
      return data[0][0][3];
    }
    
    // Alternative: try data[1] which sometimes contains transliteration
    if (data && data[1] && Array.isArray(data[1]) && data[1][0] && data[1][0][0]) {
      return data[1][0][0];
    }
    
    return null;
  } catch (error) {
    console.error('Transliteration error:', error);
    return null;
  }
};

