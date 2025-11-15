import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

// Try to import Voice, but handle if it's not available (e.g., in Expo Go)
let Voice: any = null;
try {
  const VoiceModule = require('@react-native-voice/voice');
  Voice = VoiceModule.default || VoiceModule;
  
  // Check if the native module is properly initialized
  // This prevents NativeEventEmitter warnings when the module isn't properly linked
  if (Voice && typeof Voice === 'object') {
    // Verify the module has the expected structure
    // If it doesn't have native methods, it's likely not properly linked
    const hasNativeMethods = Voice.start || Voice.stop || Voice.isAvailable;
    if (!hasNativeMethods) {
      Voice = null;
    }
  }
} catch (e) {
  console.warn('Voice module not available. Voice features will be disabled.');
  Voice = null;
}

interface VoiceButtonProps {
  onResult: (text: string) => void;
  language: string;
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
}

export default function VoiceButton({
  onResult,
  language,
  isListening,
  onListeningChange,
}: VoiceButtonProps) {
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const isStartingRef = useRef(false);
  const onResultRef = useRef(onResult);
  const onListeningChangeRef = useRef(onListeningChange);

  // Keep refs in sync with props
  useEffect(() => {
    onResultRef.current = onResult;
    onListeningChangeRef.current = onListeningChange;
  }, [onResult, onListeningChange]);

  useEffect(() => {
    // Check if Voice is available
    if (!Voice) {
      setIsAvailable(false);
      return;
    }

    // Try to check availability, but handle errors gracefully
    try {
      if (Voice.isAvailable && typeof Voice.isAvailable === 'function') {
        Voice.isAvailable()
          .then((available: boolean) => {
            setIsAvailable(available);
          })
          .catch(() => {
            // If check fails, assume it's not available in Expo Go
            setIsAvailable(false);
          });
      } else {
        // If isAvailable doesn't exist, assume Voice might work (for custom builds)
        // But be cautious - it may still fail at runtime
        setIsAvailable(true);
      }
    } catch (e) {
      setIsAvailable(false);
    }

    // Set up event listeners only if Voice is properly initialized
    // Check if Voice has the required methods to avoid NativeEventEmitter warnings
    if (Voice && typeof Voice === 'object' && (Voice.start || Voice.onSpeechStart !== undefined)) {
      try {
        Voice.onSpeechStart = () => {
          onListeningChangeRef.current(true);
          setError('');
        };
        Voice.onSpeechEnd = () => {
          onListeningChangeRef.current(false);
        };
        Voice.onSpeechResults = (e: any) => {
          if (e.value && e.value.length > 0) {
            onResultRef.current(e.value[0]);
          }
          onListeningChangeRef.current(false);
        };
        Voice.onSpeechError = (e: any) => {
          const errorCode = e.error?.code;
          const errorMessage = e.error?.message || 'Speech recognition error';
          
          // Handle different error codes from Android SpeechRecognizer:
          // Error code 5: ERROR_CLIENT - Client-side error (service busy, unavailable, network issues)
          // Error code 6: ERROR_RECOGNIZER_BUSY - Recognizer service is busy
          // Error code 7: ERROR_NO_MATCH - No speech match found (not critical, user can try again)
          // Error code 9: ERROR_INSUFFICIENT_PERMISSIONS - Missing microphone permissions
          let userFriendlyMessage = errorMessage;
          if (errorCode === '5') {
            // Error code 5: ERROR_CLIENT - Client-side error (service busy, unavailable, etc.)
            userFriendlyMessage = 'Voice recognition service is busy or unavailable. Please try again in a moment.';
          } else if (errorCode === '7') {
            // Error code 7: ERROR_NO_MATCH - No speech match found (not critical)
            userFriendlyMessage = 'No speech detected. Please try speaking again.';
            setError(userFriendlyMessage);
            onListeningChangeRef.current(false);
            return; // Don't show alert for "no match" errors
          } else if (errorCode === '6') {
            // Error code 6: ERROR_RECOGNIZER_BUSY - Recognizer service is busy
            userFriendlyMessage = 'Voice recognition is busy. Please wait a moment and try again.';
          } else if (errorCode === '9') {
            // Error code 9: ERROR_INSUFFICIENT_PERMISSIONS - Missing permissions
            userFriendlyMessage = 'Microphone permission is required. Please enable it in settings.';
          }
          
          setError(userFriendlyMessage);
          onListeningChangeRef.current(false);
          
          // Only show alert for critical errors (not code 7 "No match")
          if (errorCode !== '7') {
            Alert.alert('Voice Error', userFriendlyMessage);
          }
        };
      } catch (e) {
        // If setting up listeners fails, voice is not available
        setIsAvailable(false);
      }
    } else {
      setIsAvailable(false);
    }

    return () => {
      if (Voice && typeof Voice.destroy === 'function') {
        try {
          // Stop any active recognition before cleanup
          Voice.stop().catch(() => {
            // Ignore stop errors during cleanup
          });
          
          Voice.destroy()
            .then(() => {
              if (Voice && typeof Voice.removeAllListeners === 'function') {
                Voice.removeAllListeners();
              }
            })
            .catch(() => {
              // Ignore cleanup errors
            });
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const startListening = async () => {
    if (!Voice || !isAvailable) {
      Alert.alert(
        'Voice Not Available',
        'Voice recognition requires a custom development build. Please use text input instead, or build the app with EAS Build to enable voice features.'
      );
      return;
    }

    // If already listening or starting, don't start again
    if (isListening || isStartingRef.current) {
      return;
    }

    isStartingRef.current = true;

    try {
      setError('');
      
      // Stop any existing recognition session first to prevent conflicts
      try {
        await Voice.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convert language code to Voice format (e.g., 'en' -> 'en-US')
      const voiceLang = language === 'en' ? 'en-US' : 
                       language === 'fil' ? 'fil-PH' :
                       language === 'vi' ? 'vi-VN' :
                       language === 'th' ? 'th-TH' : language;
      
      await Voice.start(voiceLang);
    } catch (err: any) {
      const errorCode = err.code;
      let errorMessage = err.message || 'Failed to start voice recognition';
      
      // Handle specific error codes
      if (errorCode === '5') {
        errorMessage = 'Voice recognition service is busy or unavailable. Please try again in a moment.';
      } else if (errorCode === '6') {
        errorMessage = 'Voice recognition is busy. Please wait a moment and try again.';
      } else if (errorCode === '9') {
        errorMessage = 'Microphone permission is required. Please enable it in settings.';
      } else if (errorMessage.includes('already')) {
        // Already listening/starting - this is fine, just return
        return;
      }
      
      setError(errorMessage);
      onListeningChange(false);
      
      // Only show alert for critical errors (not code 7 "No match" and not "already" errors)
      if (errorCode !== '7' && !errorMessage.includes('already')) {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      isStartingRef.current = false;
    }
  };

  const stopListening = async () => {
    if (!Voice || !isAvailable) return;
    
    // If not listening, nothing to stop
    if (!isListening) {
      return;
    }
    
    try {
      await Voice.stop();
      onListeningChange(false);
      setError('');
    } catch (err: any) {
      console.error('Error stopping voice:', err);
      // Even if stop fails, update the state
      onListeningChange(false);
    }
  };

  const handlePress = () => {
    if (!isAvailable) {
      Alert.alert(
        'Voice Not Available',
        'Voice recognition requires a custom development build. Please use text input instead.'
      );
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isAvailable && Voice === null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.buttonDisabled]}
          disabled
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="microphone-off"
            size={32}
            color="#999"
          />
        </TouchableOpacity>
        <Text style={styles.disabledText}>Voice unavailable in Expo Go</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isListening && styles.buttonListening,
          !isAvailable && styles.buttonDisabled,
        ]}
        onPress={handlePress}
        disabled={!isAvailable}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={isListening ? 'microphone' : 'microphone-outline'}
          size={32}
          color={isAvailable ? '#FFFFFF' : '#999'}
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!isAvailable && !error && (
        <Text style={styles.disabledText}>Voice requires custom build</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonListening: {
    backgroundColor: '#FF5722',
    transform: [{ scale: 1.1 }],
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#FF5722',
    textAlign: 'center',
  },
  disabledText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

