import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getQuickPhrases } from '../constants/quickPhrases';
import { QuickPhrase } from '../types';
import { hasNonLatinCharacters } from '../utils/transliteration';

interface DictionaryModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage?: string;
}

export default function DictionaryModal({ 
  visible, 
  onClose, 
  selectedLanguage = 'fil' 
}: DictionaryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const phrases = getQuickPhrases(selectedLanguage);
  const filteredPhrases = phrases.filter(
    (phrase) =>
      phrase.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Offline Dictionary</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Dictionary Info Section */}
          <View style={styles.dictionaryInfo}>
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={theme.colors.primary} />
            <Text style={styles.dictionaryInfoText}>
              Offline Dictionary ({phrases.length} phrases)
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search phrases..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Phrases List - Scrollable */}
          <ScrollView 
            style={styles.phrasesList}
            contentContainerStyle={styles.phrasesListContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            nestedScrollEnabled={true}
          >
            {filteredPhrases.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No phrases found</Text>
                <Text style={styles.emptySubtext}>
                  Try searching with different keywords
                </Text>
              </View>
            ) : (
              filteredPhrases.map((phrase: QuickPhrase, index: number) => (
                <View key={index} style={styles.phraseItem}>
                  <View style={styles.phraseContent}>
                    <Text style={styles.phraseEnglish}>{phrase.english}</Text>
                    <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
                    {phrase.transliteration && hasNonLatinCharacters(phrase.translation) && (
                      <Text style={styles.phraseTransliteration}>{phrase.transliteration}</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    height: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  dictionaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.primaryContainer,
    gap: 8,
    backgroundColor: '#FAFAFA',
  },
  dictionaryInfoText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.primaryContainer,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
  phrasesList: {
    flex: 1,
    width: '100%',
  },
  phrasesListContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
  phraseItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  phraseContent: {
    gap: 4,
  },
  phraseEnglish: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  phraseTranslation: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  phraseTransliteration: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

