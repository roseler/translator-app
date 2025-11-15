import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LANGUAGES, getLanguageByCode } from '../constants/languages';
import { theme } from '../theme';

interface LanguageSelectorProps {
  label: string;
  selectedLanguage: string;
  onSelect: (code: string) => void;
}

export default function LanguageSelector({
  label,
  selectedLanguage,
  onSelect,
}: LanguageSelectorProps) {
  const [visible, setVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const buttonRef = useRef<TouchableOpacity>(null);

  const selectedLang = getLanguageByCode(selectedLanguage);

  const handleSelect = (code: string) => {
    onSelect(code);
    setVisible(false);
  };

  const handleButtonPress = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
        setVisible(true);
      });
    } else {
      setVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.dropdownButton}
        onPress={handleButtonPress}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedLang?.name}
        </Text>
        <MaterialCommunityIcons 
          name="chevron-down" 
          size={20} 
          color={theme.colors.text} 
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View 
            style={[
              styles.dropdownContainer,
              buttonLayout && {
                left: buttonLayout.x,
                width: buttonLayout.width,
                top: buttonLayout.y + buttonLayout.height + 4,
              },
            ]}
          >
            <ScrollView
              style={styles.dropdownList}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {LANGUAGES.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.languageItem,
                    selectedLanguage === item.code && styles.selectedLanguageItem,
                  ]}
                  onPress={() => handleSelect(item.code)}
                >
                  <Text style={styles.languageText}>
                    {item.name}
                  </Text>
                  {selectedLanguage === item.code && (
                    <MaterialCommunityIcons 
                      name="check" 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.primaryContainer,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 400,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedLanguageItem: {
    backgroundColor: '#F5F5F5',
  },
  languageText: {
    fontSize: 15,
    color: theme.colors.text,
  },
});

