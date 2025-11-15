# Setup Checklist - Harmony Translator App

## Pre-Installation Checklist 

- [ ] Computer is turned on
- [ ] Internet connection is working
- [ ] Smartphone is charged
- [ ] Have about 30 minutes available

## Installation Checklist 

### Step 1: Install Node.js
- [ ] Downloaded Node.js from https://nodejs.org/
- [ ] Installed Node.js (followed all default options)
- [ ] Restarted computer after installation
- [ ] Verified installation: Opened terminal and typed `node --version`
  - [ ] Saw version number (v16 or higher)

### Step 2: Setup Project
- [ ] Opened project folder (`translator-app`)
- [ ] Opened terminal/command prompt in project folder
- [ ] Ran: `npm install --legacy-peer-deps`
  - [ ] Saw "added X packages" message
  - [ ] No critical errors appeared

### Step 3: Install Expo Go on Phone (SDK 51 Required!)
- [ ] Installed **Expo Go SDK 51** app on smartphone
  - [ ] **Android:** Downloaded from [Expo Go SDK 51 for Android](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
  - [ ] **iPhone:** Installed from App Store (latest version, SDK 51 compatible)
- [ ] Verified Expo Go version supports SDK 51
- [ ] Opened Expo Go app at least once

### Step 4: Start the App
- [ ] In terminal, typed: `npm start`
- [ ] Saw QR code appear on screen
- [ ] Noted the `exp://` address shown

### Step 5: Connect Phone
- [ ] Made sure phone and computer are on same Wi-Fi network
- [ ] Opened Expo Go app on phone
- [ ] Tapped "Scan QR Code"
- [ ] Scanned QR code from computer screen
- [ ] Waited for app to load (30-60 seconds)
- [ ] App appeared on phone screen ✅

## Testing Checklist ✅

### Basic Translation
- [ ] App opens successfully on phone
- [ ] Can see language dropdowns (top of screen)
- [ ] Can select "From" language
- [ ] Can select "To" language
- [ ] Can type text in input box
- [ ] Can tap "Translate" button
- [ ] Translation appears in result box
- [ ] Can see translated text correctly

### Text-to-Speech
- [ ] After translating, can tap speaker icon
- [ ] Hears audio playback of translation
- [ ] Sound is clear and understandable

### History Feature
- [ ] Can navigate to "History" screen
- [ ] Can see list of past translations
- [ ] Can tap on a history entry to see details

### Copy Feature
- [ ] Can tap copy icon next to translation
- [ ] Can paste translation in another app

## Troubleshooting Checklist (If Problems Occur)

### Problem: Can't Install Node.js
- [ ] Tried downloading from official website again
- [ ] Checked if antivirus is blocking installation
- [ ] Restarted computer and tried again
- [ ] Checked system requirements match

### Problem: npm Command Not Working
- [ ] Verified Node.js is installed: `node --version`
- [ ] Verified npm is installed: `npm --version`
- [ ] If not found, reinstalled Node.js
- [ ] Restarted terminal after installation

### Problem: Installation Fails
- [ ] Checked internet connection
- [ ] Tried running: `npm install --legacy-peer-deps` again
- [ ] Checked if in correct folder (should see `package.json`)
- [ ] Closed other programs and tried again

### Problem: App Won't Connect to Phone
- [ ] Verified phone and computer on same Wi-Fi
- [ ] Closed and reopened Expo Go app
- [ ] Tried typing the `exp://` URL manually in Expo Go
- [ ] Checked if firewall is blocking connection
- [ ] Restarted development server: Press `r` in terminal

### Problem: App Crashes or Won't Load
- [ ] Closed Expo Go app completely
- [ ] Restarted development server: Press `r` in terminal
- [ ] Scanned QR code again
- [ ] Waited longer for initial load (first time is slower)

### Problem: SDK Version Mismatch Error
- [ ] Verified Expo Go app is SDK 51 version
- [ ] **Android:** Downloaded correct version from [Expo Go SDK 51 for Android](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
- [ ] **iOS:** Updated Expo Go from App Store to latest version
- [ ] Uninstalled old Expo Go and reinstalled correct version
- [ ] Restarted phone after installing

## Quick Reference Commands

| What You Want to Do | Command to Type |
|---------------------|-----------------|
| Install dependencies | `npm install --legacy-peer-deps` |
| Start the app | `npm start` |
| Restart app (if already running) | Press `r` in terminal |
| Stop the app | Press `Ctrl + C` in terminal |

## Success Criteria 

You've successfully set up the app when:
-  Terminal shows QR code when you type `npm start`
-  Expo Go app can scan and load the app
-  App opens and shows translation interface
-  You can translate text from one language to another
-  You can hear the translation using text-to-speech
-  History screen shows your past translations

## Need Help?

**Common Issues:**
1. "Command not found" → Node.js not installed properly
2. "Cannot connect" → Check Wi-Fi networks match
3. "App won't load" → Wait longer, restart server
4. "npm install errors" → Use `--legacy-peer-deps` flag
5. "SDK version mismatch" → **Install Expo Go SDK 51!** [Android link](https://expo.dev/go?sdkVersion=51&platform=android&device=true)

**Remember:**
- First setup takes longer (downloading dependencies)
- App must reload after code changes (automatic)
- Keep terminal window open while using app
- Phone and computer must stay on same Wi-Fi

---

**Status:** ☐ Not Started | ☐ In Progress | ☐ Complete

