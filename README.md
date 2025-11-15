# Harmony App - Translator

A mobile translation app built with React Native and Expo that helps connect voices across language barriers. Designed to help international and local students communicate effectively.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Simple step-by-step guide for clients (easy to understand)
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Setup checklist for reference
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Technical documentation for thesis defense (detailed explanation of how the app works)

## Features

- 🌍 **Multi-language Support**: Translate between multiple languages including English, Filipino, Vietnamese, Thai, and more
- ⌨️ **Text Input**: Type your text for translation
- 🎤 **Voice Input**: Speak your text for translation (requires custom development build)
- 🔊 **Text-to-Speech**: Listen to translations in the target language
- 📱 **Offline Mode**: Use quick phrases even without internet connection
- 📚 **Translation History**: Save and review your past translations
- 📖 **Dictionary**: Browse offline quick phrases for common expressions
- 🎨 **Modern UI**: Beautiful purple-themed interface matching the design

### ⚠️ Note about Voice Features

**Voice recognition requires a custom development build** and won't work in Expo Go. To enable voice features:

1. Build a custom development client using EAS Build
2. Or test voice features on a physical device with a custom build

The app will gracefully disable voice features in Expo Go and show a message. All other features work perfectly in Expo Go!

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **Expo Speech** for text-to-speech
- **@react-native-voice/voice** for speech recognition
- **AsyncStorage** for local data persistence
- **Google Translate API** for translations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)
- **Expo Go app SDK 51** on your mobile device (required version!)
  - **Android:** Download from [Expo Go SDK 51 for Android](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
  - **iOS:** Latest version from App Store (SDK 51 compatible)

### Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

**Note:** If you encounter dependency conflicts during installation, use the `--legacy-peer-deps` flag. This is normal for React Native projects with many dependencies.

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **Important:** Make sure you have Expo Go SDK 51 installed!
   - Android: Download from [Expo Go SDK 51 for Android](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
   - Scan the QR code with Expo Go (iOS) or Camera app (Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
translator-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── LanguageSelector.tsx
│   │   ├── VoiceButton.tsx
│   │   └── QuickPhrases.tsx
│   ├── screens/          # App screens
│   │   ├── TranslateScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── DictionaryScreen.tsx
│   ├── services/         # Business logic
│   │   ├── translationService.ts
│   │   └── storageService.ts
│   ├── constants/        # App constants
│   │   ├── languages.ts
│   │   └── quickPhrases.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── theme.ts          # App theme
├── App.tsx               # Main app component
├── app.json              # Expo configuration
└── package.json
```

## Features in Detail

### Translation
- Select source and target languages
- Input text via keyboard or voice
- Get instant translations
- Listen to translations with text-to-speech
- Copy translations to clipboard

### Offline Mode
- Toggle offline mode to use local dictionary
- Access quick phrases without internet
- Perfect for areas with poor connectivity

### History
- View all past translations
- Search through history
- Listen to previous translations
- Clear history when needed

### Dictionary
- Browse offline quick phrases
- Search for specific phrases
- View translations for multiple languages
- Learn common expressions

## Building APK

There are two ways to build an APK for your app:

### Method 1: Using EAS Build (Recommended)

EAS Build is the easiest and most reliable way to build your APK. It builds your app in the cloud.

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account**:
   ```bash
   eas login
   ```

3. **Build APK for preview/testing**:
   ```bash
   eas build --platform android --profile preview
   ```
   This creates an APK that you can install directly on Android devices.

4. **Build APK for production**:
   ```bash
   eas build --platform android --profile production
   ```
   This creates a production-ready APK.

5. **Download the APK**:
   - After the build completes, EAS will provide a download link
   - You can also run `eas build:list` to see all your builds and download links
   - Or visit [expo.dev](https://expo.dev) and go to your project's builds page

**Note:** The first build may take 10-20 minutes. Subsequent builds are usually faster.

### Method 2: Local Build (Advanced)

You can also build the APK locally on your machine:

1. **Prerequisites**:
   - Install [Android Studio](https://developer.android.com/studio)
   - Set up Android SDK and environment variables
   - Install Java JDK

2. **Generate native code** (if needed):
   ```bash
   npx expo prebuild
   ```

3. **Build the APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   (On Windows: `gradlew.bat assembleRelease`)

4. **Find your APK**:
   The APK will be located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

5. **Install on device**:
   - Transfer the APK to your Android device
   - Enable "Install from Unknown Sources" in your device settings
   - Open the APK file to install

### Building AAB (Android App Bundle) for Google Play Store

If you want to publish to Google Play Store, build an AAB instead:

```bash
eas build --platform android --profile production
```

Then select "aab" when prompted, or add this to your `eas.json`:
```json
"production": {
  "autoIncrement": true,
  "android": {
    "buildType": "app-bundle"
  }
}
```

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## License

ISC

## Acknowledgments

Built as part of a project to help international students at Batangas State University communicate more effectively with local students.
