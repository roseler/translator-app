import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getQuickPhrases } from '../constants/quickPhrases';
import { theme } from '../theme';

interface QuickPhrasesProps {
  language: string;
  onSelect: (phrase: string) => void;
  offlineMode: boolean;
}

export default function QuickPhrases({
  language,
  onSelect,
  offlineMode,
}: QuickPhrasesProps) {
  const phrases = getQuickPhrases(language);
  // Limit to 6 phrases as shown in the design
  const displayPhrases = phrases.slice(0, 6);

  if (displayPhrases.length === 0) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="book-open-variant" size={18} color={theme.colors.primary} />
            <Text style={styles.title}>
              Quick Phrases{offlineMode ? ' (Offline)' : ''}
            </Text>
          </View>
        </View>
        <FlatList
          key={`quick-phrases-${language}-${displayPhrases.length}-3`}
          data={displayPhrases}
          keyExtractor={(item, index) => `${item.english}-${index}`}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.phraseItem}
              onPress={() => onSelect(item.english)}
            >
              <Text style={styles.phraseText}>{item.english}</Text>
            </TouchableOpacity>
          )}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  phraseItem: {
    flex: 1,
    margin: 4,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phraseText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
  },
});

