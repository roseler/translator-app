# Android Studio Setup Guide - Harmony Translator App

This guide will help you configure Android Studio to run and build the Harmony Translator App.

## Prerequisites

Before setting up Android Studio, ensure you have:
- ✅ **Node.js** installed (v16 or higher) - Check with `node --version`
- ✅ **npm** installed - Check with `npm --version`
- ✅ Project dependencies installed - Run `npm install --legacy-peer-deps` in the project root

## Step 1: Install Android Studio

1. Download Android Studio from [https://developer.android.com/studio](https://developer.android.com/studio)
2. Install Android Studio following the setup wizard
3. During installation, ensure you install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD) - for emulator

## Step 2: Install Required SDK Components

Open Android Studio and configure the following:

### 2.1 Open SDK Manager
- Go to **Tools** → **SDK Manager** (or click the SDK Manager icon in the toolbar)
- Or go to **File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Android SDK**

### 2.2 Install Required Components

#### SDK Platforms Tab:
- ✅ **Android 14.0 (API Level 34)** - Check the box to install
- ✅ **Android SDK Platform 34** - Required for compileSdkVersion 34
- (Optional) **Android 13.0 (API Level 33)** - If you want to support older versions

#### SDK Tools Tab:
- ✅ **Android SDK Build-Tools 34.0.0** - Required (match the version in build.gradle)
- ✅ **Android SDK Command-line Tools** (latest)
- ✅ **Android SDK Platform-Tools** (latest)
- ✅ **Android Emulator** - If you want to use an emulator
- ✅ **Intel x86 Emulator Accelerator (HAXM installer)** - For Windows/Intel Mac (faster emulation)
- ✅ **NDK (Side by side)** - Install **version 26.1.10909125** (required)
  - Expand "NDK (Side by side)" and check the box for version **26.1.10909125**
- ✅ **Google Play services** (optional but recommended)

#### Apply Changes
- Click **Apply** or **OK** to install all selected components

### 2.3 Install JDK/JRE

Android Studio comes with a bundled JDK, but you can also use a system JDK:

- Android Studio usually bundles **JDK 17** or **JDK 11**, which works fine
- To verify: Go to **File** → **Project Structure** → **SDK Location** → Check **JDK location**

## Step 3: Configure Android Studio Settings

### 3.1 Gradle Settings
1. Go to **File** → **Settings** (or **Android Studio** → **Preferences** on Mac)
2. Navigate to **Build, Execution, Deployment** → **Build Tools** → **Gradle**
3. Configure:
   - **Gradle JDK**: Select the bundled JDK (usually JDK 17 or JDK 11)
   - **Build and run using**: Select **Gradle** (recommended)
   - **Run tests using**: Select **Gradle** (recommended)
   - **Gradle projects**: Use **Gradle 'wrapper' task configuration**

### 3.2 Memory Settings
1. Go to **File** → **Settings** → **Appearance & Behavior** → **System Settings** → **Memory Settings**
2. Set:
   - **IDE max heap size**: 2048 MB (or higher if you have more RAM)
   - This matches the Gradle JVM args in `gradle.properties`

### 3.3 Android SDK Location
1. Go to **File** → **Project Structure** → **SDK Location**
2. Verify the **Android SDK location** path (usually `C:\Users\<username>\AppData\Local\Android\Sdk` on Windows)
3. Make note of this path - you may need it for environment variables

## Step 4: Open the Project in Android Studio

### 4.1 Open Project
1. Open Android Studio
2. Click **Open** (or **File** → **Open**)
3. Navigate to your project folder: `C:\Users\roseler\Documents\GitHub\translator-app`
4. **Important**: Select the `android` folder (not the root project folder)
   - Path should be: `C:\Users\roseler\Documents\GitHub\translator-app\android`
5. Click **OK**

### 4.2 Trust Gradle Project
- Android Studio will ask if you trust the Gradle project - Click **Trust Project**

### 4.3 Wait for Gradle Sync
- Android Studio will automatically sync Gradle dependencies
- This may take 5-15 minutes on first setup (downloading Gradle 8.8 and dependencies)
- Watch the status bar at the bottom for progress

## Step 5: Configure Project-Specific Settings

### 5.1 Verify Gradle Configuration
Android Studio should automatically detect:
- ✅ Gradle version: **8.8** (from `gradle-wrapper.properties`)
- ✅ Kotlin version: **1.9.23**
- ✅ Android SDK: **API 34**

### 5.2 Check Build Variants
1. Open the **Build Variants** panel (View → Tool Windows → Build Variants)
2. Ensure **debug** variant is selected for both app and react-settings-plugin

### 5.3 Verify Signing Configuration
The project uses a debug keystore (already configured in `build.gradle`):
- **Debug keystore**: `android/app/debug.keystore`
- Password: `android`
- This is automatically configured for debug builds

## Step 6: Set Up Android Emulator (Optional)

### 6.1 Create Virtual Device
1. Go to **Tools** → **Device Manager** (or click the Device Manager icon)
2. Click **Create Device**
3. Select a device definition (e.g., **Pixel 5** or **Pixel 6**)
4. Click **Next**
5. Select a system image:
   - **API Level 34** (Android 14.0) - Recommended
   - Or **API Level 33** (Android 13.0) - Also works
   - Click **Download** if not installed
6. Click **Next** and **Finish**

### 6.2 Start Emulator
- Click the **Play** button next to your created emulator
- Wait for it to boot up

## Step 7: Run the App

### Method 1: Run from Android Studio
1. **Start Metro Bundler First** (Required!):
   - Open a terminal in the **project root** (not the android folder)
   - Run: `npm start` or `npx expo start`
   - Keep this terminal window open

2. In Android Studio:
   - Select your device/emulator from the device dropdown (top toolbar)
   - Click the **Run** button (green play icon) or press **Shift + F10**
   - Wait for the build to complete and app to install

### Method 2: Run from Command Line
1. **Start Metro Bundler**:
   ```bash
   npm start
   ```

2. In a new terminal (keep Metro running):
   ```bash
   npm run android
   ```
   Or:
   ```bash
   npx expo run:android
   ```

### Method 3: Build APK Only
1. In Android Studio:
   - Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for build to complete
   - APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

## Step 8: Troubleshooting

### Problem: Run Button is Greyed Out ⚠️

This is one of the most common issues! Here's how to fix it:

**Step 1: Check Device Selection**
- Look at the top toolbar in Android Studio
- Click the device dropdown (next to the run button)
- Make sure a device/emulator is selected:
  - If no device appears: **Tools** → **Device Manager** → Create/Start an emulator
  - Or connect a physical device via USB (enable USB debugging)
  - Wait for device to appear in the dropdown (may take 10-30 seconds)

**Step 2: Check Run Configuration**
- Go to **Run** → **Edit Configurations...**
- If the list is empty, click **+** → **Android App**
- Set:
  - **Name**: `app`
  - **Module**: `android.app` (should auto-detect)
  - **Launch**: `Default Activity`
- Click **OK**

**Step 3: Check Build Variant**
- Open **Build Variants** panel: **View** → **Tool Windows** → **Build Variants**
- For the `app` module, select **debug** variant
- Close the panel

**Step 4: Ensure Gradle Sync Completed**
- Check the bottom status bar for "Gradle sync" status
- If sync failed:
  - Click the **Sync** icon (🔄) in the toolbar
  - Or **File** → **Sync Project with Gradle Files**
  - Wait for sync to complete (check for errors)

**Step 5: Verify Project Structure**
- Make sure you opened the **`android`** folder (not root project)
- Path should be: `...\translator-app\android`
- Go to **File** → **Project Structure**
- Check **Modules** → Should see `android.app`

**Step 6: Create Run Configuration Manually** (If still greyed out)
1. Go to **Run** → **Edit Configurations...**
2. Click **+** → **Android App**
3. Configure:
   - **Name**: `app`
   - **Module**: Select `android.app` from dropdown
   - **General** tab:
     - **Launch**: Select `Default Activity`
     - **Launch Options**: Leave default
   - **Deployment** tab:
     - **Deploy**: `Default APK`
     - **Install Flags**: (leave empty)
4. Click **OK**

**Step 7: Check for Errors**
- Look at the **Build** output at the bottom of Android Studio
- Look for red error messages
- Fix any errors shown (SDK not found, missing dependencies, etc.)

**Step 8: Invalidate Caches and Restart**
- **File** → **Invalidate Caches** → **Invalidate and Restart**
- Wait for Android Studio to restart
- Wait for Gradle sync to complete again

**Still Not Working?**
- Close Android Studio completely
- Delete `.idea` folder in the `android` directory (if exists)
- Delete `.gradle` folder in the `android` directory (if exists)
- Reopen the `android` folder in Android Studio
- Wait for Gradle sync

**Quick Checklist:**
- ✅ Device/emulator selected in dropdown?
- ✅ Run configuration exists for `app` module?
- ✅ Build variant is `debug`?
- ✅ Gradle sync completed without errors?
- ✅ Opened the `android` folder (not root)?

### Problem: Gradle Build Failed - "exited with non-zero code: 1" ⚠️

This error means the Gradle build command failed. You need to see the actual error details.

**Step 1: Get Detailed Error Output**

The error message shown is incomplete. You need to see the full Gradle output:

**Option A: Run Gradle Command Directly**
1. Open a terminal/command prompt
2. Navigate to the `android` folder:
   ```bash
   cd C:\Users\roseler\Documents\GitHub\translator-app\android
   ```
3. Run the build command:
   ```bash
   gradlew.bat app:assembleDebug
   ```
4. Look for the actual error message (usually in red or at the end)

**Option B: Check Android Studio Build Output**
1. In Android Studio, go to **View** → **Tool Windows** → **Build**
2. Or check **Build** tab at the bottom
3. Look for red error messages - they show the actual problem

**Step 2: Common Causes and Fixes**

**Issue 1: Missing Android SDK Components**
- **Error**: "SDK location not found" or "Failed to find target with hash string 'android-34'"
- **Fix**: 
  - Open SDK Manager: **Tools** → **SDK Manager**
  - Install **Android SDK Platform 34**
  - Install **Android SDK Build-Tools 34.0.0**
  - Click **Apply**

**Issue 2: NDK Not Found**
- **Error**: "NDK version '26.1.10909125' is not installed" or similar
- **Fix**:
  - Open SDK Manager → **SDK Tools** tab
  - Check "Show Package Details" at bottom right
  - Expand **NDK (Side by side)**
  - Check **26.1.10909125** specifically
  - Uncheck other NDK versions to avoid conflicts
  - Click **Apply** and wait for download

**Issue 3: Missing Gradle Plugin Version**
- **Error**: "Could not resolve com.android.tools.build:gradle" or similar
- **Fix**: The `build.gradle` may need a version specified
  - Check if you have internet connection
  - Try: **File** → **Invalidate Caches** → **Invalidate and Restart**
  - Or manually add version in `android/build.gradle`:
    ```gradle
    classpath('com.android.tools.build:gradle:8.3.0')
    ```

**Issue 4: Java/JDK Version Issues** ⚠️ **COMMON FIX NEEDED!**
- **Error**: "Unsupported class file major version 68" or "Unsupported class file major version" or "Java version not supported"
  - **Version 68 = Java 24** (too new!)
  - **Version 65 = Java 21** (may not work)
  - **Version 61 = Java 17** (✅ Recommended)
  - **Version 55 = Java 11** (✅ Also works)
- **Fix - Important: Check ALL Java Settings!**
  1. **Fix Project Language Level** (Often the culprit!)
     - Go to **File** → **Project Structure** → **Project** (left sidebar)
     - Find **Language level** dropdown
     - Change from **"24 - Stream gatherers"** to **"17 - Sealed types, always-strict floating-point semantics"**
     - ⚠️ **This must match your SDK version!** If SDK is 17, Language level must be 17 or lower
     - Click **Apply** or **OK**
  
  2. Check your system Java version:
     ```bash
     java -version
     ```
  
  3. Configure Project SDK (should match Language level):
     - **File** → **Project Structure** → **Project**
     - **SDK** should be set to **temurin-17** or **Eclipse Temurin 17**
     - If not, click dropdown → **Edit** → Add JDK 17 if needed
     - Ensure **SDK** and **Language level** both match (both 17)
  
  4. Configure Build Tools JDK:
     - **File** → **Project Structure** → **SDK Location** (left sidebar)
     - Set **JDK location** to JDK 17:
       - Android Studio bundled: `C:\Program Files\Android\Android Studio\jbr`
       - Or your temurin-17 installation folder
     - Click **Apply**
  
  5. Configure Gradle JDK:
     - **File** → **Settings** → **Build Tools** → **Gradle**
     - Under **Gradle JDK**, select **jbr-17** or **temurin-17** (JDK 17)
     - NOT Java 21 or 24!
     - Click **Apply** or **OK**
  
  6. If you don't have JDK 17:
     - **Option A: Use Android Studio's bundled JDK** (Easiest!)
       - Path: `C:\Program Files\Android\Android Studio\jbr`
     - **Option B: Download JDK 17**
       - Download from [Adoptium (Temurin)](https://adoptium.net/)
       - Install and point Android Studio to it
  
  7. **Restart Android Studio** after making these changes
  
  8. Sync Gradle:
     - Click **Sync** icon (🔄) in toolbar
     - Or **File** → **Sync Project with Gradle Files**

**Issue 5: Debug Keystore Missing**
- **Error**: "keystore file does not exist: debug.keystore"
- **Fix**: 
  - Navigate to `android/app/` folder
  - Check if `debug.keystore` file exists
  - If missing, run in terminal (from `android/app` folder):
    ```bash
    keytool -genkeypair -v -storetype PKCS12 -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
    ```

**Issue 6: Gradle Wrapper Issues**
- **Error**: "Gradle version not found" or wrapper errors
- **Fix**:
  - Delete `android/.gradle` folder (cache)
  - In Android Studio: **File** → **Settings** → **Build Tools** → **Gradle**
  - Make sure **Use Gradle from** is set to `gradle-wrapper.properties`
  - Click **Sync**

**Issue 7: Corrupted Gradle Cache**
- **Error**: Various dependency resolution errors
- **Fix**:
  ```bash
  1. Close Android Studio
  2. Delete folders:
     - android/.gradle (if exists)
     - android/build (if exists)
     - android/app/build (if exists)
     - ~/.gradle/caches (user home, not project)
  3. Reopen Android Studio
  4. File → Sync Project with Gradle Files
  ```

**Step 3: Clean and Rebuild**

Try these commands in order (from `android` folder):

```bash
# Clean build
gradlew.bat clean

# Clean and rebuild
gradlew.bat clean assembleDebug

# If that fails, try with more info
gradlew.bat clean assembleDebug --info --stacktrace
```

**Step 4: Verify Environment**

Run these checks:

1. **Check Java version**:
   ```bash
   java -version
   ```
   Should show Java 17 or 11

2. **Check Android SDK**:
   - Environment variable `ANDROID_HOME` should be set
   - Or verify SDK path in Android Studio: **File** → **Project Structure** → **SDK Location**

3. **Check Node.js**:
   ```bash
   node --version
   ```
   Should be v16 or higher

**Step 5: Get Full Error Log**

If you still can't see the error, enable verbose logging:

1. In Android Studio: **File** → **Settings** → **Build Tools** → **Gradle**
2. Under **Gradle projects**, check **Debug mode**
3. Try building again
4. Check **Build** output tab for detailed errors

**Quick Diagnostic Commands** (run from `android` folder):

```bash
# Check if Gradle wrapper works
gradlew.bat --version

# Check if dependencies resolve
gradlew.bat dependencies --configuration debugRuntimeClasspath

# Try building with stacktrace (shows full error)
gradlew.bat assembleDebug --stacktrace

# Try with info level (even more details)
gradlew.bat assembleDebug --info --stacktrace
```

### Problem: Gradle Sync Failed
**Solutions:**
- Check internet connection (Gradle needs to download dependencies)
- Go to **File** → **Invalidate Caches** → **Invalidate and Restart**
- Check if JDK is properly configured
- Verify Android SDK location is correct

### Problem: SDK Not Found
**Solutions:**
- Go to **File** → **Project Structure** → **SDK Location**
- Verify Android SDK path is correct
- Reinstall SDK Platform 34 from SDK Manager

### Problem: NDK Version Mismatch
**Solutions:**
- Open SDK Manager → SDK Tools tab
- Expand "NDK (Side by side)"
- Install version **26.1.10909125** specifically
- Or update `android/build.gradle` if you want to use a different NDK version

### Problem: Build Tools Version Not Found
**Solutions:**
- Open SDK Manager → SDK Tools tab
- Install **Android SDK Build-Tools 34.0.0**
- If not available, install the latest version and update `build.gradle` accordingly

### Problem: "Cannot resolve symbol" errors
**Solutions:**
- Go to **File** → **Invalidate Caches** → **Invalidate and Restart**
- Wait for Gradle sync to complete
- Try **Build** → **Rebuild Project**

### Problem: App Crashes on Launch
**Solutions:**
- Ensure Metro bundler is running (`npm start` in project root)
- Check device/emulator is connected: `adb devices`
- Check Logcat in Android Studio for error messages
- Try **Build** → **Clean Project**, then rebuild

### Problem: "Unable to load script" error
**Solutions:**
- This means Metro bundler is not running
- Start Metro with `npm start` in the project root
- Make sure Metro is running before launching the app

### Problem: Metro Bundler Connection Error ⚠️ **"failed to connect to /192.168.x.x (port 8081)"**

This error means your app can't connect to the Metro bundler (development server).

**Error Message Example:**
```
failed to connect to /192.168.137.94 (port 8081) from /192.168.18.36 (port 57182) after 10000ms
```

**Common Causes & Fixes:**

**Step 1: Check if Metro Bundler is Running**
1. In your terminal/command prompt, run:
   ```bash
   npm start
   ```
2. You should see a QR code and Metro bundler starting
3. Keep this terminal window open while using the app

**Step 2: Verify Same Wi-Fi Network**
- Your phone and computer MUST be on the same Wi-Fi network
- **Phone IP:** `192.168.18.36` (from error message)
- **Computer IP:** `192.168.137.94` (from error message)
- ⚠️ **Problem:** These are on different networks! (`192.168.18.x` vs `192.168.137.x`)
- **Fix:** Connect both devices to the same Wi-Fi network

**Step 3: Find Your Computer's Correct IP Address**
1. On Windows, open Command Prompt and run:
   ```bash
   ipconfig
   ```
2. Look for **"IPv4 Address"** under **"Wireless LAN adapter Wi-Fi"**
3. It should be something like `192.168.1.x` or `192.168.0.x`
4. Make sure your phone is on the same network (same first three numbers)

**Step 4: Restart Metro Bundler with Correct IP**
1. Stop Metro bundler (press `Ctrl + C` in terminal)
2. Start it again:
   ```bash
   npm start
   ```
3. Metro will detect the correct IP automatically

**Step 5: Check Firewall Settings**
- Windows Firewall might be blocking port 8081
- **Fix:**
  1. Open **Windows Defender Firewall**
  2. Go to **Advanced settings**
  3. Click **Inbound Rules** → **New Rule**
  4. Select **Port** → **TCP** → **Specific local ports: 8081**
  5. Allow the connection
  6. Repeat for **Outbound Rules**

**Step 6: Manual IP Configuration (If Auto-Detection Fails)**
1. In terminal, run:
   ```bash
   npm start -- --host YOUR_IP_ADDRESS
   ```
   Replace `YOUR_IP_ADDRESS` with your computer's IP (e.g., `192.168.1.100`)
2. Or use:
   ```bash
   npx expo start --host tunnel
   ```
   This uses Expo's tunnel service (works across networks but slower)

**Step 7: For Physical Devices - Shake and Reload**
1. Shake your phone (or press menu button on Android)
2. Tap **"Reload"** in the dev menu
3. This forces the app to reconnect to Metro

**Step 8: Alternative - Use USB Connection (Android)**
If Wi-Fi is problematic, use USB:
1. Connect phone via USB
2. Enable USB debugging
3. In terminal, run:
   ```bash
   adb reverse tcp:8081 tcp:8081
   npm start
   ```
4. This tunnels Metro through USB

**Quick Checklist:**
- ✅ Metro bundler running (`npm start`)?
- ✅ Phone and computer on same Wi-Fi network?
- ✅ Firewall allowing port 8081?
- ✅ Correct IP address shown in Metro output?
- ✅ Tried reloading the app on phone?

**Still Not Working?**
- Try using Expo's tunnel mode:
  ```bash
  npx expo start --tunnel
  ```
- Or check if your router has AP isolation enabled (disable it)
- Make sure you're not on a guest network with device isolation

## Step 9: Environment Variables (Optional but Recommended)

Set up environment variables for easier command-line access:

### Windows:
1. Open **System Properties** → **Environment Variables**
2. Add new system variable:
   - **Variable name**: `ANDROID_HOME`
   - **Variable value**: `C:\Users\<username>\AppData\Local\Android\Sdk` (or your SDK path)
3. Add to **Path** variable:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

### Verify:
Open a new terminal and run:
```bash
adb version
```
Should show ADB version if configured correctly.

## Quick Reference

### Project Configuration Summary:
- **Gradle Version**: 8.8
- **Kotlin Version**: 1.9.23
- **Android SDK**: API 34 (Android 14.0)
- **Min SDK**: API 23 (Android 6.0)
- **Target SDK**: API 34
- **Build Tools**: 34.0.0
- **NDK Version**: 26.1.10909125
- **Hermes**: Enabled
- **Package Name**: com.harmonyapp.translator

### Important Paths:
- **Project Root**: `C:\Users\roseler\Documents\GitHub\translator-app`
- **Android Project**: `C:\Users\roseler\Documents\GitHub\translator-app\android`
- **Open in Android Studio**: The `android` folder (not root)

### Common Commands:
```bash
# Start Metro bundler (MUST run before launching app)
npm start

# Run on Android (starts Metro automatically)
npm run android

# Build debug APK
cd android
./gradlew assembleDebug

# Clean build
cd android
./gradlew clean
```

## Success Criteria

You've successfully configured Android Studio when:
- ✅ Android Studio opens the `android` project without errors
- ✅ Gradle sync completes successfully
- ✅ No red error indicators in the IDE
- ✅ You can build the project (Build → Build Project)
- ✅ App launches on emulator/device when Metro is running

## Need More Help?

- **Android Studio Documentation**: https://developer.android.com/studio
- **React Native Android Setup**: https://reactnative.dev/docs/environment-setup
- **Expo Development Builds**: https://docs.expo.dev/development/introduction/

