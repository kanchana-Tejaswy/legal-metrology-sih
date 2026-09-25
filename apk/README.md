# 📱 Android APK & Mobile Application Deliverables

This directory is the dedicated destination for the **Legal Metrology (SIH 26036)** compiled Android APK files.

---

## 📂 Project Folder Separation Guide

| Folder | What It Contains | How To Use It |
|---|---|---|
| **`apk/`** | 📦 **Compiled Android APKs** | Direct `.apk` files to install on your phone |
| **`frontend/android/`** | 🛠️ **Native Android Studio Project** | Open this folder in Android Studio to build/debug natively |
| **`frontend/`** | 🌐 **React Web Application** | Web source code, UI components, and styles |
| **`backend/`** | ⚡ **Express REST API & Database** | Backend server, auth, Supabase connection |

---

## 📥 How to Get the APK File

### Option 1: Download Directly from GitHub (No Setup Needed)
1. Go to the repository on GitHub: **[kanchana-Tejaswy/legal-metrology-sih](https://github.com/kanchana-Tejaswy/legal-metrology-sih)**
2. Click the **"Actions"** tab at the top.
3. Click the latest workflow run.
4. Under the **"Artifacts"** section, click **`legal-metrology-debug-apk`** to download!

---

### Option 2: Build Locally with 1-Click
Run the [`build-apk.bat`](../build-apk.bat) script in the main project folder.
It will automatically build and place the generated APK directly in this `apk/` folder:
* **`apk/LegalMetrology-debug.apk`**

---

### Option 3: Build in Android Studio
1. Open **Android Studio**.
2. Click **Open** and select the `frontend/android` folder.
3. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
4. The output will be located at:
   `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📲 Installation on Android Phone
1. Transfer `LegalMetrology-debug.apk` to your phone via USB / WhatsApp / Drive.
2. Tap the file and select **Install**.
3. If prompted with *"Install Unknown Apps"*, toggle **Allow from this source**.
4. Open the app to access the **Department of Legal Metrology Verification System**.
