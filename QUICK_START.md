# Quick Start Guide - Harmony Translator App

## Simple Requirements 

**What You Need:**
- A computer (Windows, Mac, or Linux)
- Internet connection
- A smartphone (Android or iPhone)
- About 30 minutes of time

**Software to Install:**
1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - This gives you `npm` (Node Package Manager) automatically

2. **Expo Go** app on your smartphone (SDK 51 version required!)
   - **Important:** You MUST use Expo SDK 51 version
   - Android: Download from [Expo Go SDK 51 for Android](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
   - iOS: Download from App Store (make sure it's SDK 51 compatible)

## Step-by-Step Setup (Super Simple!)

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Click the green "Download" button (it will download the right version for your computer)
3. Run the installer and follow the instructions
4. Click "Next" on everything (default settings are fine!)
5. Restart your computer after installation

**How to Check if It Worked:**
- Open Command Prompt (Windows) or Terminal (Mac/Linux)
- Type: `node --version`
- You should see something like `v18.17.0` or higher 

### Step 2: Open the Project Folder
1. Find your project folder: `translator-app`
2. Right-click in the folder
3. Choose "Open in Terminal" or "Open PowerShell here"
4. You should see a black window with text

### Step 3: Install App Dependencies (One Command!)
Type this command and press Enter:
```bash
npm install --legacy-peer-deps
```

**What This Does:**
- Downloads all the tools and libraries the app needs
- Takes 2-5 minutes (you'll see lots of text scrolling)
- When you see "added X packages" it's done! 

**Note:** Don't worry if you see some warnings - that's normal!

### Step 4: Start the App (One More Command!)
Type this command and press Enter:
```bash
npm start
```

**What Happens:**
- A window opens showing a QR code
- You'll see a URL like `exp://192.168.1.5:8081`

### Step 5: Run on Your Phone

#### For Android:
1. **Install Expo Go SDK 51** (required version!)
   - Download from: [Expo Go SDK 51 for Android](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
   - Or scan the QR code on that page directly
   - **Important:** Make sure you get SDK 51, not an older version!
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from your computer screen
5. Wait 30-60 seconds for the app to load
6. The app opens on your phone! 🎉

#### For iPhone:
1. **Install Expo Go SDK 51** (required version!)
   - Install from App Store (latest version should support SDK 51)
   - Make sure your Expo Go app supports SDK 51
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from your computer screen
5. Wait 30-60 seconds for the app to load
6. The app opens on your phone! 

### Step 6: Test the App
1. **Translate Text:**
   - Select languages (top dropdowns)
   - Type text in the input box
   - Tap "Translate" button
   - See translation appear! 

2. **Listen to Translation:**
   - After translating, tap the speaker icon
   - Hear the translation spoken! 

3. **View History:**
   - Tap "History" at the bottom
   - See all your past translations! 

## That's It! You're Done! 

The app is now running on your phone. As long as:
- Your computer is on
- The terminal window stays open
- Your phone and computer are on the same Wi-Fi

You can use the app!

---

## Troubleshooting (If Something Goes Wrong)

### Problem: "npm is not recognized"
**Solution:** Node.js isn't installed properly. Reinstall Node.js and restart your computer.

### Problem: "Cannot connect to server"
**Solution:** Make sure your phone and computer are on the same Wi-Fi network.

### Problem: QR code doesn't work
**Solution:** Try typing the URL manually in Expo Go app (the exp:// address you see)

### Problem: App shows "SDK version mismatch" or won't load
**Solution:** You need Expo Go SDK 51! 
- Android: Download from [Expo Go SDK 51 for Android](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
- iOS: Update Expo Go from App Store to latest version
- Make sure your Expo Go app matches SDK 51

### Problem: App won't start
**Solution:** Close everything and try again:
1. Close the terminal
2. Open it again in the project folder
3. Type `npm start` again

---

## Need Help?
- Make sure Node.js version is 16 or higher: `node --version`
- Make sure you're in the right folder (should contain `package.json`)
- Make sure you ran `npm install --legacy-peer-deps` first
- Make sure your phone and computer are on same Wi-Fi

---

## What Each Button Does (For Your Client)

- **Language Dropdowns (Top):** Choose what language to translate FROM and TO
- **Text Box:** Type what you want to translate
- **Translate Button:** Get the translation
- **Speaker Icon:** Listen to the translation
- **Copy Icon:** Copy translation to clipboard
- **History Button:** See all your past translations
- **Voice Button (Microphone):** Speak instead of typing (only works in special builds)
- **Offline Mode Toggle:** Use offline phrases without internet

That's everything in simple terms! 

