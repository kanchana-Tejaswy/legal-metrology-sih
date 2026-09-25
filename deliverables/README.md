# 📦 SIH 26036 Project Deliverables & Separated Packages

This folder contains pre-packaged, standalone `.zip` archives that you can download, extract, and share with teammates, evaluators, or clients.

---

## 1. 🌐 Web Application Package
* **File**: [`web-app-build.zip`](./web-app-build.zip)
* **What it is**: Complete production-ready web application build (`index.html`, compiled CSS stylesheets, JS bundles, and public SVG assets).
* **How to use**:
  1. Extract `web-app-build.zip`.
  2. Upload contents to any static web host (Vercel, Netlify, Cloudflare Pages, NGINX, or Apache).
  3. No build tools needed on the target machine.

---

## 2. 📱 Android App Project Package
* **File**: [`android-app-project.zip`](./android-app-project.zip)
* **What it is**: Complete standalone native Android Studio project with Gradle build scripts, AndroidManifest, adaptive vector icons, splash screen, and `build-apk.bat`.
* **How to use**:
  1. Extract `android-app-project.zip`.
  2. Open the extracted folder in **Android Studio**.
  3. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)** to generate the APK.
  4. (Or double-click `build-apk.bat` on Windows).

---

## 🔁 How to Re-generate These Packages
Whenever you make updates to the code, simply run:
```bat
package-deliverables.bat
```
in the project root to automatically re-compile and refresh both `.zip` packages!
