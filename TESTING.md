# Testing Guide for Harmony App

## Quick Start

### 1. Install Expo Go on Your Phone
- **iOS**: Download "Expo Go" from the App Store
- **Android**: Download "Expo Go" from Google Play Store

### 2. Start the Development Server
```bash
npm start
```

This will:
- Start the Metro bundler
- Display a QR code in your terminal
- Open Expo DevTools in your browser

### 3. Connect Your Phone

**For iOS:**
1. Open the Camera app
2. Point it at the QR code in the terminal
3. Tap the notification that appears
4. The app will open in Expo Go

**For Android:**
1. Open the Expo Go app
2. Tap "Scan QR code"
3. Scan the QR code from the terminal
4. The app will load

## Testing on Emulators/Simulators

### iOS Simulator (Mac only)
```bash
npm run ios
```
Requires Xcode installed. Opens in iOS Simulator automatically.

### Android Emulator
```bash
npm run android
```
Requires Android Studio and an emulator set up. Make sure an emulator is running first.

### Web Browser (Limited - mobile features won't work)
```bash
npm run web
```
Note: Voice recognition and some mobile features won't work in web browser.

## What to Test

### ✅ Core Translation Features
- [ ] Select "From" language (e.g., English)
- [ ] Select "To" language (e.g., Filipino)
- [ ] Swap languages using the swap button
- [ ] Type text in the input field
- [ ] Click "Translate" button
- [ ] Verify translation appears
- [ ] Test with different language pairs

### ✅ Voice Input
- [ ] Tap the purple microphone button
- [ ] Grant microphone permission when prompted
- [ ] Speak into microphone
- [ ] Verify speech is converted to text
- [ ] Test with different languages

### ✅ Text-to-Speech
- [ ] After getting a translation, tap the speaker icon
- [ ] Verify the translation is read aloud
- [ ] Test with different languages

### ✅ Offline Mode
- [ ] Toggle "Offline" switch ON
- [ ] Type a quick phrase like "hello" or "thank you"
- [ ] Verify translation works without internet
- [ ] Check that offline info card appears

### ✅ Quick Phrases
- [ ] Scroll to Quick Phrases section
- [ ] Tap on a quick phrase (e.g., "hello")
- [ ] Verify it fills the input field
- [ ] Translate and verify it works

### ✅ History Screen
- [ ] Make several translations
- [ ] Navigate to "History" tab
- [ ] Verify all translations appear
- [ ] Tap speaker icon on a history item
- [ ] Test "Clear All" button

### ✅ Dictionary Screen
- [ ] Navigate to "Dictionary" tab
- [ ] Select different languages (Filipino, Vietnamese, Thai)
- [ ] Verify phrases change
- [ ] Use search bar to find specific phrases
- [ ] Verify search works correctly

### ✅ UI/UX
- [ ] Check purple theme is applied
- [ ] Verify navigation between tabs works
- [ ] Test on both portrait and landscape (if supported)
- [ ] Check that UI elements are properly sized
- [ ] Verify buttons and interactions are responsive

## Troubleshooting

### App won't load
- Make sure your phone and computer are on the same WiFi network
- Try restarting the development server: `npm start`
- Clear Expo Go cache: Shake device → "Reload"

### Voice input not working
- Check microphone permissions in device settings
- Make sure you granted permission when prompted
- On Android, you may need to enable permissions manually in Settings

### Translations not working
- Check your internet connection (unless in offline mode)
- Verify you're not using offline mode for complex translations
- Try restarting the app

### Build errors
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: Should be v16 or higher

## Permissions Required

- **Microphone**: For voice input (speech-to-text)
- **Internet**: For online translations (optional if using offline mode)
- **Storage**: For saving translation history

## Testing Checklist Summary

- [x] App starts successfully
- [ ] Translation works (online)
- [ ] Translation works (offline)
- [ ] Voice input works
- [ ] Text-to-speech works
- [ ] History saves and displays
- [ ] Dictionary shows phrases
- [ ] UI matches design
- [ ] Navigation works smoothly
- [ ] No crashes or errors

## Next Steps After Testing

1. Report any bugs or issues
2. Suggest improvements to UI/UX
3. Test on multiple devices if possible
4. Test with different language combinations
5. Verify offline mode works without internet

