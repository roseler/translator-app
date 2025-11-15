# Technical Documentation - Harmony Translator App
## For Thesis Defense Presentation

---

## 1. Project Overview

### Purpose
Harmony Translator is a mobile application designed to facilitate communication between international and local students at Batangas State University by providing real-time text translation, voice input capabilities, and offline phrase dictionaries.

### Technology Stack
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **UI Library:** React Native Paper
- **Navigation:** React Navigation (Native Stack)
- **Translation API:** Google Translate (Free endpoint)
- **Storage:** AsyncStorage (Local device storage)
- **Speech:** Expo Speech (TTS) and @react-native-voice/voice (STT)

---

## 2. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         User Interface (UI)             │
│  ┌──────────┐  ┌──────────┐            │
│  │Translate │  │ History  │            │
│  │ Screen   │  │ Screen   │            │
│  └────┬─────┘  └────┬─────┘            │
└───────┼──────────────┼──────────────────┘
        │              │
        ▼              ▼
┌─────────────────────────────────────────┐
│      Service Layer                      │
│  ┌──────────────────┐  ┌──────────────┐│
│  │ Translation      │  │ Storage      ││
│  │ Service          │  │ Service      ││
│  └────────┬─────────┘  └──────┬───────┘│
└───────────┼────────────────────┼────────┘
            │                    │
            ▼                    ▼
┌─────────────────────────────────────────┐
│      External/Internal Services         │
│  ┌──────────────────┐  ┌──────────────┐│
│  │ Google Translate │  │ AsyncStorage ││
│  │ API              │  │ (Local DB)   ││
│  └──────────────────┘  └──────────────┘│
└─────────────────────────────────────────┘
```

### Component Structure

```
App.tsx (Root)
├── SafeAreaProvider
├── PaperProvider (Theme)
└── NavigationContainer
    └── Stack Navigator
        ├── TranslateScreen (Main)
        └── HistoryScreen
```

---

## 3. Core Functionalities Explained

### 3.1 Translation System

**How It Works:**
1. User inputs text in source language
2. App sends request to Google Translate API
3. API returns translated text + detected language + transliteration
4. App displays result to user
5. Translation is saved to local storage (history)

**Code Location:** `src/services/translationService.ts`

**Key Functions:**
- `translateText()` - Main translation function
- Handles both online (API) and offline (local phrases) modes
- Includes error handling and fallback mechanisms

**API Details:**
- Endpoint: `https://translate.googleapis.com/translate_a/single`
- Method: GET request
- No API key required (free endpoint)
- Parameters: `sl` (source language), `tl` (target language), `q` (query text)

### 3.2 Offline Mode

**How It Works:**
- Pre-defined common phrases stored in `src/constants/quickPhrases.ts`
- When offline mode is enabled, app checks local dictionary first
- Falls back to API if phrase not found locally
- Provides transliteration (pronunciation guide) for non-Latin scripts

**Benefits:**
- Works without internet
- Faster response for common phrases
- Useful in areas with poor connectivity

### 3.3 History Management

**How It Works:**
1. Every successful translation is saved automatically
2. Stored in AsyncStorage (device local storage)
3. History screen displays all saved translations
4. Users can search, replay, and clear history

**Storage Structure:**
```typescript
{
  id: string,
  originalText: string,
  translatedText: string,
  fromLanguage: string,
  toLanguage: string,
  timestamp: number
}
```

**Code Location:** `src/services/storageService.ts`

### 3.4 Voice Features

**Text-to-Speech (TTS):**
- Uses Expo Speech API
- Converts translated text to audio
- Supports multiple languages
- Works immediately in Expo Go

**Speech-to-Text (STT):**
- Uses @react-native-voice/voice library
- Requires custom development build
- Not available in Expo Go (native module limitation)
- Gracefully handles missing permissions/capabilities

### 3.5 Language Support

**Supported Languages:**
- English (en)
- Filipino/Tagalog (fil)
- Vietnamese (vi)
- Thai (th)
- And more (extensible via `src/constants/languages.ts`)

**Language Codes:**
- ISO 639-1 standard codes
- Used for API communication
- Stored in language constants file

---

## 4. Data Flow Diagrams

### Translation Flow

```
User Input Text
      │
      ▼
[Translate Button Clicked]
      │
      ▼
Check Offline Mode?
      │
      ├─── YES ───> Search Local Phrases ───> Found? ───> Display Result
      │                                        │
      │                                        └─── NO ───> Error Message
      │
      └─── NO ───> Call Google Translate API
                        │
                        ├─── Success ───> Extract Translation
                        │                      │
                        │                      ▼
                        │                 Save to History
                        │                      │
                        │                      ▼
                        │                 Display to User
                        │
                        └─── Error ───> Try Offline Phrases ───> Show Error
```

### History Management Flow

```
Translation Completed
      │
      ▼
Create History Object
      │
      ▼
Save to AsyncStorage
      │
      ▼
[User Opens History Screen]
      │
      ▼
Load All Entries from Storage
      │
      ▼
Display in List
      │
      ├─── User Taps Entry ───> Show Details
      │
      ├─── User Searches ───> Filter Results
      │
      └─── User Clears ───> Delete from Storage ───> Refresh Display
```

---

## 5. Technical Implementation Details

### 5.1 State Management

**Approach:** React Hooks (useState, useEffect)

**Key States in TranslateScreen:**
- `fromLang` / `toLang` - Selected languages
- `inputText` - User input
- `translatedText` - Translation result
- `isTranslating` - Loading state
- `offlineMode` - Feature toggle
- `isListening` - Voice input state

**Why This Approach:**
- Simple and lightweight
- No external state management library needed
- Easy to understand and maintain

### 5.2 Error Handling

**Strategy:** Multi-layered error handling

1. **API Level:**
   - Try-catch blocks around API calls
   - Network error detection
   - Response validation

2. **Service Level:**
   - Fallback to offline phrases
   - User-friendly error messages
   - Logging for debugging

3. **UI Level:**
   - Alert dialogs for critical errors
   - Loading indicators during operations
   - Graceful degradation (e.g., voice features)

### 5.3 Performance Optimizations

1. **Lazy Loading:**
   - Components loaded only when needed
   - Navigation screens loaded on demand

2. **Local Caching:**
   - Translation history cached locally
   - Quick phrases loaded once

3. **Optimized Re-renders:**
   - Proper use of React.memo where needed
   - Efficient state updates

### 5.4 Security Considerations

1. **API Communication:**
   - HTTPS only (secure connections)
   - No sensitive data in URLs
   - Text encoding for special characters

2. **Local Storage:**
   - Device-only storage (no cloud sync)
   - User data privacy respected
   - Clear history option available

---

## 6. Project Structure Explanation

```
translator-app/
├── App.tsx                    # Root component, navigation setup
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
│
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── LanguageSelector  # Language dropdown selector
│   │   ├── VoiceButton       # Voice input button
│   │   └── QuickPhrases      # Offline phrases component
│   │
│   ├── screens/              # Main app screens
│   │   ├── TranslateScreen   # Main translation interface
│   │   ├── HistoryScreen     # Translation history view
│   │   └── DictionaryScreen  # Offline phrases dictionary
│   │
│   ├── services/             # Business logic layer
│   │   ├── translationService  # Translation API integration
│   │   └── storageService      # Local storage operations
│   │
│   ├── constants/            # Static data
│   │   ├── languages         # Language definitions
│   │   └── quickPhrases      # Offline phrase database
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts          # Shared interfaces
│   │
│   ├── utils/                # Utility functions
│   │   └── transliteration   # Text transliteration helpers
│   │
│   └── theme.ts              # App-wide styling theme
│
└── assets/                   # Images, icons, splash screens
```

**Design Pattern:** Separation of Concerns
- **Components:** Presentation logic only
- **Services:** Business logic and API calls
- **Constants:** Configuration and static data
- **Types:** Type safety and documentation

---

## 7. Key Features Breakdown

### Feature 1: Multi-Language Translation
- **Technology:** Google Translate API
- **Implementation:** RESTful API calls
- **Edge Cases:** Network failures, API rate limits
- **Solution:** Offline fallback, error handling

### Feature 2: Text-to-Speech
- **Technology:** Expo Speech
- **Implementation:** Native module integration
- **Capabilities:** Multi-language voice synthesis
- **User Experience:** One-tap audio playback

### Feature 3: Speech-to-Text
- **Technology:** @react-native-voice/voice
- **Limitation:** Requires custom build (not in Expo Go)
- **Implementation:** Native module with permission handling
- **Fallback:** Graceful degradation with user message

### Feature 4: Offline Mode
- **Technology:** Local phrase database
- **Implementation:** In-memory array with search
- **Benefits:** No internet required, instant results
- **Limitation:** Limited phrase set

### Feature 5: Translation History
- **Technology:** AsyncStorage
- **Implementation:** JSON serialization
- **Features:** Search, filter, replay, delete
- **Storage:** Local device only (privacy)

---

## 8. Development Workflow

### Setup Process
1. Install Node.js (runtime environment)
2. Install dependencies (`npm install`)
3. Start development server (`npm start`)
4. Connect device via Expo Go app

### Testing
- **Development:** Expo Go app (most features)
- **Production:** Custom build required (voice features)
- **Platforms:** iOS and Android supported

### Building for Production
- **Method:** EAS Build (Expo Application Services)
- **Output:** APK (Android) or IPA (iOS)
- **Process:** Cloud-based build, no local setup needed

---

## 9. Limitations and Future Improvements

### Current Limitations
1. **Voice Input:** Requires custom build (not in Expo Go)
2. **Offline Mode:** Limited to pre-defined phrases
3. **Translation API:** Free endpoint has rate limits
4. **Language Support:** Depends on Google Translate

### Future Enhancement Opportunities
1. **Custom API:** Implement paid Google Translate API for reliability
2. **Offline Database:** Expand offline phrase dictionary
3. **User Accounts:** Cloud sync for history across devices
4. **Custom Models:** Train custom translation models for specific domains
5. **Real-time Translation:** WebSocket-based instant translation
6. **Image Translation:** OCR-based text extraction and translation

---

## 10. Testing and Quality Assurance

### Testing Strategy
1. **Manual Testing:**
   - Feature testing on real devices
   - Cross-platform testing (iOS/Android)
   - Network condition testing (offline/online)

2. **User Testing:**
   - Beta testing with students
   - Feedback collection
   - Usability improvements

### Known Issues and Solutions
1. **Voice Module Warnings:** Suppressed in Expo Go (expected behavior)
2. **API Rate Limits:** Handled with error messages and offline fallback
3. **Network Timeouts:** Implemented timeout handling and retry logic

---

## 11. Conclusion

The Harmony Translator App successfully combines modern mobile development technologies to create a practical communication tool for students. The application demonstrates:

- **Effective use of React Native** for cross-platform development
- **Integration of multiple APIs** (Translation, TTS, STT)
- **Robust error handling** and offline capabilities
- **User-friendly interface** with modern UI components
- **Scalable architecture** for future enhancements

This project serves as a foundation for understanding mobile app development, API integration, and user-centered design in the context of educational technology.

---

## Appendix: Technical Specifications

### Minimum Requirements
- **Node.js:** v16 or higher
- **React Native:** 0.74.5
- **Expo SDK:** 51.0.0
- **Device:** Android 6.0+ / iOS 13.0+

### Dependencies Summary
- **Core:** React, React Native, Expo
- **UI:** React Native Paper, Navigation
- **Services:** Axios (HTTP), AsyncStorage
- **Voice:** Expo Speech, @react-native-voice/voice

### API Endpoints Used
- Google Translate: `translate.googleapis.com/translate_a/single`
- Method: GET
- Authentication: None required (free endpoint)

---

**Document Version:** 1.0
**Last Updated:** November 2024
**Author:** For Thesis Defense Presentation

