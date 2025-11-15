import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  TextInput as RNTextInput,
  Alert,
} from 'react-native';
import {
  Button,
  Card,
  Text,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import LanguageSelector from '../components/LanguageSelector';
import VoiceButton from '../components/VoiceButton';
import QuickPhrases from '../components/QuickPhrases';
import DictionaryModal from './DictionaryScreen';
import { translateText } from '../services/translationService';
import { saveTranslation, getOfflineMode, setOfflineMode } from '../services/storageService';
import { LANGUAGES, getLanguageByCode } from '../constants/languages';
import { getQuickPhrases } from '../constants/quickPhrases';
import { hasNonLatinCharacters } from '../utils/transliteration';
import * as Speech from 'expo-speech';

// Clipboard import with fallback for when native module isn't available
let Clipboard: any = null;
try {
  Clipboard = require('expo-clipboard');
} catch (e) {
  // Module not available - will use fallback
}

export default function TranslateScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('fil');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [offlineMode, setOfflineModeState] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dictionaryVisible, setDictionaryVisible] = useState(false);

  useEffect(() => {
    loadOfflineMode();
  }, []);

  const loadOfflineMode = async () => {
    const offline = await getOfflineMode();
    setOfflineModeState(offline);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translateText(inputText, fromLang, toLang, offlineMode);
      setTranslatedText(result.translatedText);
      setTransliteration(result.transliteration || '');

      // Save to history
      await saveTranslation({
        id: Date.now().toString(),
        originalText: inputText,
        translatedText: result.translatedText,
        fromLanguage: fromLang,
        toLanguage: toLang,
        timestamp: Date.now(),
      });
    } catch (error: any) {
      console.error('Translation error in UI:', error);
      const errorMessage = error.message || 'Translation failed. Please try again.';
      setTranslatedText('');
      setTransliteration('');
      // Show error in a user-friendly way
      Alert.alert(
        'Translation Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakTranslation = () => {
    if (translatedText) {
      const languageCode = toLang === 'fil' ? 'fil-PH' : toLang;
      Speech.speak(translatedText, { language: languageCode });
    }
  };

  const handleCopyTranslation = async () => {
    if (!translatedText) return;
    
    try {
      if (Clipboard && Clipboard.setStringAsync) {
        await Clipboard.setStringAsync(translatedText);
        Alert.alert('Copied', 'Translation copied to clipboard');
      } else {
        // Fallback: show alert with text to copy manually
        Alert.alert('Copy Translation', translatedText, [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('Copy error:', error);
      Alert.alert('Error', 'Failed to copy translation');
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setTransliteration('');
  };

  const handleSwapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleToggleOffline = async () => {
    const newValue = !offlineMode;
    setOfflineModeState(newValue);
    await setOfflineMode(newValue);
  };

  const handleVoiceResult = (text: string) => {
    setInputText(text);
    setIsListening(false);
  };

  const handleQuickPhraseSelect = async (phrase: string) => {
    setInputText(phrase);
      // Auto-translate quick phrases, especially for offline mode
      if (phrase.trim()) {
        setIsTranslating(true);
        try {
          const result = await translateText(phrase, fromLang, toLang, offlineMode);
          setTranslatedText(result.translatedText);
          
          // Get transliteration from result or from quick phrases
          if (result.transliteration) {
            setTransliteration(result.transliteration);
          } else {
            const quickPhrases = getQuickPhrases(toLang);
            const foundPhrase = quickPhrases.find(p => p.english.toLowerCase() === phrase.toLowerCase());
            setTransliteration(foundPhrase?.transliteration || '');
          }

          // Save to history
          await saveTranslation({
            id: Date.now().toString(),
            originalText: phrase,
            translatedText: result.translatedText,
            fromLanguage: fromLang,
            toLanguage: toLang,
            timestamp: Date.now(),
          });
        } catch (error: any) {
          // For offline mode, this is expected for phrases not in dictionary
          if (!offlineMode) {
            setTranslatedText(error.message || 'Translation failed');
          }
        } finally {
          setIsTranslating(false);
        }
      }
  };

  const fromLangData = getLanguageByCode(fromLang);
  const toLangData = getLanguageByCode(toLang);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header with Purple Banner */}
        <View style={[styles.headerBanner, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="earth" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.appNameContainer}>
              <Text style={styles.appName}>Harmony App</Text>
              <Text style={styles.tagline}>Connect Without Barriers</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.offlinePill, offlineMode ? styles.offlinePillOffline : styles.offlinePillOnline]}
            onPress={handleToggleOffline}
          >
            <MaterialCommunityIcons
              name={offlineMode ? "wifi-off" : "wifi"}
              size={18}
              color={offlineMode ? "#FFFFFF" : theme.colors.primary}
            />
            <Text style={[styles.offlinePillText, !offlineMode && styles.offlinePillTextOnline]}>
              {offlineMode ? "Offline" : "Online"}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, styles.headerButtonActive]}
            onPress={() => navigation.navigate('Translate' as never)}
          >
            <MaterialCommunityIcons name="translate" size={20} color={theme.colors.primary} />
            <Text style={[styles.headerButtonText, styles.headerButtonTextActive]}>Translate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('History' as never)}
          >
            <MaterialCommunityIcons name="clock-outline" size={20} color="#FFFFFF" />
            <Text style={styles.headerButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Language Selection Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.languageCardHeader}>
              <View style={styles.selectLanguagesHeader}>
                <MaterialCommunityIcons name="star-outline" size={18} color={theme.colors.primary} />
                <Text style={styles.selectLanguagesText}>Select Languages</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDictionaryVisible(true)}
                style={styles.dictionaryButton}
              >
                <MaterialCommunityIcons name="book-open-variant" size={18} color={theme.colors.primary} />
                <Text style={styles.dictionaryButtonText}>Dictionary</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.languageSection}>
              <View style={styles.languageSelectorWrapper}>
                <LanguageSelector
                  label="From"
                  selectedLanguage={fromLang}
                  onSelect={setFromLang}
                />
              </View>
              
              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwapLanguages}
              >
                <MaterialCommunityIcons
                  name="swap-horizontal"
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              
              <View style={styles.languageSelectorWrapper}>
                <LanguageSelector
                  label="To"
                  selectedLanguage={toLang}
                  onSelect={setToLang}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Main Translation Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.inputHeader}>
              <View style={styles.speakOrTypeContainer}>
                <View style={styles.dot} />
                <Text style={styles.speakOrTypeText}>Speak or Type</Text>
              </View>
              {inputText.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <RNTextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={offlineMode ? "Enter text or use voice..." : "Try: 'How are you?' or tap the mic..."}
              multiline
              numberOfLines={4}
              style={styles.textInput}
              placeholderTextColor="#999"
              autoFocus={false}
              underlineColorAndroid="transparent"
              onSubmitEditing={handleTranslate}
              blurOnSubmit={false}
              returnKeyType="done"
            />
            
            <View style={styles.actionButtonsContainer}>
              <View style={styles.voiceButtonContainer}>
                <VoiceButton
                  onResult={handleVoiceResult}
                  language={fromLang}
                  isListening={isListening}
                  onListeningChange={setIsListening}
                />
              </View>
              
              {inputText.trim() && (
                <Button
                  mode="contained"
                  onPress={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  style={styles.translateButton}
                  loading={isTranslating}
                  contentStyle={styles.translateButtonContent}
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Translation Result Card */}
        {(translatedText || (inputText && (isTranslating || (offlineMode && !translatedText)))) && (
          <Card style={styles.translationCard}>
            <Card.Content>
              <View style={styles.translationCardHeader}>
                <View style={styles.translationCardHeaderLeft}>
                  <View style={styles.translationDot} />
                  <Text style={styles.translationCardTitle}>Translation</Text>
                </View>
                {translatedText && !isTranslating && (
                  <View style={styles.translationActionButtons}>
                    <TouchableOpacity
                      style={styles.translationActionButton}
                      onPress={handleSpeakTranslation}
                    >
                      <MaterialCommunityIcons name="volume-high" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.translationActionButton}
                      onPress={handleCopyTranslation}
                    >
                      <MaterialCommunityIcons name="content-copy" size={18} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              
              <View style={styles.translationCardContent}>
                {isTranslating ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : translatedText ? (
                  <View style={styles.translationResultWrapper}>
                    <Text style={styles.translationResultText}>{translatedText}</Text>
                    {transliteration && hasNonLatinCharacters(translatedText) && (
                      <Text style={styles.transliterationText}>{transliteration}</Text>
                    )}
                  </View>
                ) : inputText && offlineMode ? (
                  <Text style={styles.translationErrorText}>
                    [Online translation would be used: "{inputText}"]
                  </Text>
                ) : null}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Quick Phrases - Only show in offline mode */}
        {offlineMode && (
          <QuickPhrases
            language={toLang}
            onSelect={handleQuickPhraseSelect}
            offlineMode={offlineMode}
          />
        )}

        {/* Mode Banner */}
        <View style={[styles.offlineBanner, offlineMode ? styles.offlineBannerOffline : styles.offlineBannerOnline]}>
          <MaterialCommunityIcons 
            name="star-outline" 
            size={18} 
            color={offlineMode ? "#FFFFFF" : theme.colors.primary} 
          />
          <Text style={[styles.offlineBannerText, !offlineMode && styles.offlineBannerTextOnline]}>
            {offlineMode 
              ? "Offline Mode: Using local dictionary. Try phrases like 'How are you?' or 'Thank you' for instant translations!"
              : "Online Mode: Connect to translation API for unlimited phrases."}
          </Text>
        </View>
        </ScrollView>

        {/* Dictionary Modal */}
        <DictionaryModal
          visible={dictionaryVisible}
          onClose={() => setDictionaryVisible(false)}
          selectedLanguage={toLang}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerBanner: {
    backgroundColor: theme.colors.primary,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appNameContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tagline: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  offlinePillOffline: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  },
  offlinePillOnline: {
    backgroundColor: '#FFFFFF',
    borderColor: theme.colors.primary,
  },
  offlinePillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  offlinePillTextOnline: {
    color: theme.colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  headerButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtonTextActive: {
    color: theme.colors.primary,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  languageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectLanguagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectLanguagesText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  dictionaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dictionaryButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  languageSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  languageSelectorWrapper: {
    flex: 1,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  speakOrTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCC',
  },
  speakOrTypeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  clearText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  translationCard: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  translationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  translationCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  translationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  translationCardTitle: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  translationActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  translationActionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translationCardContent: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  translationResultWrapper: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  translationResultText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  transliterationText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  translationErrorText: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textInput: {
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: 'transparent',
    minHeight: 100,
    paddingHorizontal: 0,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 0,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  voiceButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  translateButton: {
    minWidth: 120,
    elevation: 0,
  },
  translateButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  offlineBannerOffline: {
    backgroundColor: theme.colors.primary,
    borderWidth: 0,
  },
  offlineBannerOnline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  offlineBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  offlineBannerTextOnline: {
    color: theme.colors.primary,
  },
});

