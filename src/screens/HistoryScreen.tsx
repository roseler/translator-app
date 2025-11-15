import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getHistory, clearHistory, deleteTranslation, getOfflineMode, setOfflineMode } from '../services/storageService';
import { Translation } from '../types';
import { getLanguageByCode } from '../constants/languages';
import { getQuickPhrases } from '../constants/quickPhrases';
import { hasNonLatinCharacters } from '../utils/transliteration';
import { theme } from '../theme';
import * as Speech from 'expo-speech';

// Clipboard import with fallback for when native module isn't available
let Clipboard: any = null;
try {
  Clipboard = require('expo-clipboard');
} catch (e) {
  // Module not available - will use fallback
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<Translation[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [offlineMode, setOfflineModeState] = useState(false);

  useEffect(() => {
    loadHistory();
    loadOfflineMode();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const translations = await getHistory();
    setHistory(translations);
  };

  const loadOfflineMode = async () => {
    const offline = await getOfflineMode();
    setOfflineModeState(offline);
  };

  const handleToggleOffline = async () => {
    const newValue = !offlineMode;
    setOfflineModeState(newValue);
    await setOfflineMode(newValue);
  };

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
    setShowClearDialog(false);
  };

  const handleDelete = async (id: string) => {
    await deleteTranslation(id);
    const translations = await getHistory();
    setHistory(translations);
  };

  const handleCopy = async (text: string) => {
    try {
      if (Clipboard && Clipboard.setStringAsync) {
        await Clipboard.setStringAsync(text);
        // Optionally show a success message
      } else {
        // Fallback: Show alert with text that user can copy manually
        Alert.alert(
          'Copy Text',
          text,
          [
            {
              text: 'OK',
              style: 'default',
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback: Show alert with text
      Alert.alert(
        'Copy Text',
        text,
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleSpeak = (text: string, language: string) => {
    const languageCode = language === 'fil' ? 'fil-PH' : language;
    Speech.speak(text, { language: languageCode });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getLanguageDisplayName = (lang: any) => {
    return lang?.name || '';
  };

  const renderItem = ({ item }: { item: Translation }) => {
    const fromLang = getLanguageByCode(item.fromLanguage);
    const toLang = getLanguageByCode(item.toLanguage);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.languagePill}>
              <Text style={styles.languagePillText}>
                {getLanguageDisplayName(fromLang)} → {getLanguageDisplayName(toLang)}
              </Text>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <MaterialCommunityIcons name="delete-outline" size={18} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.translationSection}>
            <Text style={styles.sectionLabel}>Original</Text>
            <View style={styles.textRow}>
              <Text style={styles.originalText}>{item.originalText}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleSpeak(item.originalText, item.fromLanguage)}
                >
                  <MaterialCommunityIcons name="volume-high" size={18} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleCopy(item.originalText)}
                >
                  <MaterialCommunityIcons name="content-copy" size={18} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.translationSection}>
            <Text style={[styles.sectionLabel, styles.translationLabel]}>Translation</Text>
            <View style={styles.textRow}>
              <View style={styles.translationTextWrapper}>
                <Text style={styles.translatedText}>{item.translatedText}</Text>
                {hasNonLatinCharacters(item.translatedText) && (() => {
                  // Try to get transliteration from quick phrases
                  const quickPhrases = getQuickPhrases(item.toLanguage);
                  const foundPhrase = quickPhrases.find(
                    p => p.translation === item.translatedText || 
                         p.english.toLowerCase() === item.originalText.toLowerCase()
                  );
                  if (foundPhrase?.transliteration) {
                    return <Text style={styles.transliterationText}>{foundPhrase.transliteration}</Text>;
                  }
                  return null;
                })()}
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.actionButtonPurple]}
                  onPress={() => handleSpeak(item.translatedText, item.toLanguage)}
                >
                  <MaterialCommunityIcons name="volume-high" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.actionButtonPurple]}
                  onPress={() => handleCopy(item.translatedText)}
                >
                  <MaterialCommunityIcons name="content-copy" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            style={styles.headerButton}
            onPress={() => navigation.navigate('Translate' as never)}
          >
            <MaterialCommunityIcons name="translate" size={20} color="#FFFFFF" />
            <Text style={styles.headerButtonText}>Translate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, styles.headerButtonActive]}
            onPress={() => navigation.navigate('History' as never)}
          >
            <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.headerButtonText, styles.headerButtonTextActive]}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={64}
              color={theme.colors.primary}
            />
            <Text style={styles.emptyText}>No translation history yet</Text>
            <Text style={styles.emptySubtext}>
              Your translations will appear here
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.listHeader}>
              <View>
                <Text style={styles.listTitle}>Translation History</Text>
                <Text style={styles.listCount}>{history.length} {history.length === 1 ? 'translation' : 'translations'} saved</Text>
              </View>
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={() => setShowClearDialog(true)}
              >
                <MaterialCommunityIcons name="delete-outline" size={18} color="#FFFFFF" />
                <Text style={styles.clearAllButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            
            {history.map((item) => (
              <View key={item.id}>
                {renderItem({ item })}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {showClearDialog && (
        <View style={styles.dialogOverlay}>
          <Card style={styles.dialog}>
            <Card.Content>
              <Text style={styles.dialogTitle}>Clear History?</Text>
              <Text style={styles.dialogText}>
                Are you sure you want to delete all translation history?
              </Text>
              <View style={styles.dialogActions}>
                <Button onPress={() => setShowClearDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onPress={handleClear}
                  textColor={theme.colors.error}
                >
                  Clear
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  listCount: {
    fontSize: 14,
    color: '#999',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  clearAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  languagePill: {
    backgroundColor: theme.colors.primaryContainer,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  languagePillText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  translationSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  translationLabel: {
    color: theme.colors.primary,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  originalText: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  translationTextWrapper: {
    flex: 1,
    gap: 4,
  },
  translatedText: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '500',
    lineHeight: 22,
  },
  transliterationText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPurple: {
    backgroundColor: theme.colors.primaryContainer,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    maxWidth: 400,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  dialogText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 16,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

