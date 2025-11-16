# Building Standalone APK - No Wi-Fi Required! 📱

This guide shows you how to build a standalone APK that works **completely offline** - no Metro bundler, no Wi-Fi connection needed. It's like having a real app installed on your phone.

## What You'll Get

- ✅ APK file you can install on any Android device
- ✅ Works completely offline (no internet needed after installation)
- ✅ No Metro bundler required
- ✅ No Wi-Fi connection needed
- ✅ Just like a regular app from Google Play Store

## Prerequisites

- ✅ Android Studio configured (see `ANDROID_STUDIO_SETUP.md`)
- ✅ Java/JDK 17 configured correctly
- ✅ Android SDK installed
- ✅ Project dependencies installed: `npm install --legacy-peer-deps`

## Method 1: Build Release APK (Recommended) 🎯

This creates an optimized, production-ready APK.

**⚠️ Note:** If you encounter the "Could not get unknown property 'release'" error (common with Expo SDK 51), use Method 2 (Debug APK) instead - it works perfectly fine for standalone use!

### Step 1: Build the Release APK

**Option A: Using Android Studio (Easiest)**

1. Open Android Studio
2. Open the `android` folder in Android Studio
3. Wait for Gradle sync to complete
4. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
5. Wait for the build to complete (3-5 minutes)
6. When done, click **locate** in the notification
   - Or navigate to: `android/app/build/outputs/apk/release/app-release.apk`

**Option B: Using Command Line**

1. Open terminal/command prompt
2. Navigate to project root:
   ```bash
   cd C:\Users\roseler\Documents\GitHub\translator-app
   ```
3. Build the release APK:
   ```bash
   cd android
   .\gradlew.bat assembleRelease
   ```
   **Note:** In PowerShell, use `.\gradlew.bat` (with `.\` prefix). In Command Prompt (cmd), you can use just `gradlew.bat`.
4. APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

**Option C: Using npm script (Quickest)**

The script is already added to `package.json`. Just run:
```bash
npm run build:apk
```

Or for debug APK:
```bash
npm run build:apk:debug
```

### Step 2: Install APK on Your Phone

**Method A: Transfer via USB**
1. Connect your phone to computer via USB
2. Enable **USB debugging** on phone:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"
3. Copy the APK file to your phone:
   ```bash
   # From project root
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```
   Or manually:
   - Copy `app-release.apk` to your phone
   - Open it on your phone and tap "Install"

**Method B: Transfer via Email/Cloud**
1. Email the APK to yourself
2. Or upload to Google Drive/Dropbox
3. Download on your phone and install

**Method C: Transfer via Wi-Fi/Network Share**
1. Share the APK file on your network
2. Download it on your phone
3. Install it

### Step 3: Allow Installation from Unknown Sources

When installing:
1. Android will warn "Install blocked"
2. Tap **Settings**
3. Enable **"Install unknown apps"** or **"Allow from this source"**
4. Go back and install again

## Method 2: Build Debug APK (Faster, Larger File) ⚡

Debug APKs build faster but are larger and less optimized.

**✅ Fixed for Standalone Use:** The configuration has been updated so debug APKs will:
- ✅ Bundle JavaScript into the APK (no Metro bundler needed!)
- ✅ Work completely offline (no Wi-Fi required)
- ✅ Not try to connect to development server

You just need to rebuild the debug APK after this fix.

### Using Command Line:
```bash
cd android
.\gradlew.bat assembleDebug
```
**Note:** In PowerShell, use `.\gradlew.bat`. In Command Prompt, `gradlew.bat` works.

APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Using Android Studio:
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Select **debug** variant if prompted

## Method 3: Using Expo EAS Build (Cloud Build) ☁️

If you want a signed, production-ready APK:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Configure build:
   ```bash
   eas build:configure
   ```

4. Build Android APK:
   ```bash
   eas build --platform android --profile preview
   ```
   This builds in the cloud and downloads the APK when done.

## Troubleshooting

### Problem: "Execution failed for task ':app:bundleReleaseJsAndAssets'"

**Fix:**
- Make sure you're in the project root when running commands
- Try: `npm start` first to ensure dependencies are installed
- Then: `cd android && gradlew.bat assembleRelease`

### Problem: "SDK location not found"

**Fix:**
- Make sure `android/local.properties` exists with:
  ```properties
  sdk.dir=C\:\\Users\\roseler\\AppData\\Local\\Android\\Sdk
  ```

### Problem: "Could not get unknown property 'release' for SoftwareComponent container" ⚠️

This is a known issue with Expo SDK 51 and release builds. The error occurs when building release APKs.

**Error Message:**
```
Could not get unknown property 'release' for SoftwareComponent container
Script '...expo-modules-core\android\ExpoModulesCorePlugin.gradle' line: 85
```

**Solutions (Try in order):**

**Solution 1: Use Debug APK Instead (Easiest! ✅)**
- The debug APK already built successfully at: `android/app/build/outputs/apk/debug/app-debug.apk`
- Debug APKs work perfectly fine for standalone installation
- They're just slightly larger than release APKs (but still work offline)
- Install it: `adb install android/app/build/outputs/apk/debug/app-debug.apk`
- Or use: `npm run build:apk:debug`

**Solution 2: Use EAS Build (Cloud Build - Recommended for Release)**
- This bypasses the local build issue:
  ```bash
  npm install -g eas-cli
  eas login
  eas build --platform android --profile preview
  ```
- Builds in Expo's cloud - downloads APK when done
- Always produces working release APKs

**Solution 3: Try Specifying Android Gradle Plugin Version**
Edit `android/build.gradle` and add a version:
```gradle
dependencies {
    classpath('com.android.tools.build:gradle:8.3.0')  // Specify version
    classpath('com.facebook.react:react-native-gradle-plugin')
    classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
}
```

**Solution 4: Update Expo and Dependencies**
- Try updating Expo SDK to latest patch version:
  ```bash
  npm install expo@latest
  npx expo install --fix
  ```
- Then rebuild

**Recommendation:**
For now, **use the debug APK** - it works perfectly and doesn't require Wi-Fi or Metro bundler. 

**⚠️ Important:** After the fix, you need to **rebuild** the debug APK for it to bundle the JavaScript. Just run:
```powershell
npm run build:apk:debug
```

The new APK will work completely standalone (no Metro bundler needed).

For production release, use EAS Build.

### Problem: APK is too large

**Fix:**
- Debug APKs are larger (can be 50-100MB)
- Release APKs are smaller (usually 30-50MB)
- To reduce size, enable ProGuard (see below)

### Problem: App crashes on launch

**Check:**
1. Make sure you built a **release** APK (not debug)
2. Check if all permissions are granted
3. Try building debug APK first to test

### Problem: "App not installed" error

**Fix:**
1. Uninstall any previous version first
2. Enable "Install unknown apps" in Android settings
3. Make sure you have enough storage space

## Optimizing APK Size

To make your APK smaller, edit `android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true  // Enable code minification
        shrinkResources true  // Remove unused resources
        proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
    }
}
```

**Note:** Test thoroughly after enabling minification - it can break some code.

## Building Multiple APKs (Architecture-Specific)

To build separate APKs for different CPU architectures (smaller per-APK size):

Add to `android/app/build.gradle`:
```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk false
        }
    }
}
```

Then build - you'll get separate APKs for each architecture.

## Quick Reference Commands

**For PowerShell (Windows):**
```powershell
# Build release APK
cd android
.\gradlew.bat assembleRelease

# Build debug APK (faster)
.\gradlew.bat assembleDebug

# Clean build (if having issues)
.\gradlew.bat clean
.\gradlew.bat assembleRelease
```

**For Command Prompt (cmd) or Git Bash:**
```bash
# Build release APK
cd android
gradlew.bat assembleRelease

# Build debug APK (faster)
gradlew.bat assembleDebug

# Clean build (if having issues)
gradlew.bat clean
gradlew.bat assembleRelease
```

**Using npm (works in both):**
```bash
npm run build:apk        # Release APK
npm run build:apk:debug  # Debug APK

# Install APK via ADB
adb install app/build/outputs/apk/release/app-release.apk

# Install on connected device
adb install -r app/build/outputs/apk/release/app-release.apk  # -r = reinstall
```

## APK File Locations

After building, APKs are located at:
- **Release:** `android/app/build/outputs/apk/release/app-release.apk`
- **Debug:** `android/app/build/outputs/apk/debug/app-debug.apk`

## Success! 🎉

Once installed, your app will:
- ✅ Work completely offline
- ✅ No Metro bundler needed
- ✅ No Wi-Fi connection required
- ✅ Work just like any app from Play Store
- ✅ Can be shared with others (send them the APK file)

## Next Steps

- Test all features work offline
- Share APK with friends/family for testing
- For production release, consider:
  - Signing with a release keystore
  - Uploading to Google Play Store
  - Using EAS Build for cloud builds

