@echo off
echo ================================================================
echo   GOVERNMENT OF INDIA - DEPARTMENT OF LEGAL METROLOGY (SIH 26036)
echo   Android APK Generator (Debug & Release)
echo ================================================================

echo [1/3] Building React production web bundle...
cd /d "%~dp0frontend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] React build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] Synchronizing assets with Capacitor Android...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Capacitor sync failed!
    pause
    exit /b %ERRORLEVEL%
)

echo [3/3] Compiling Android APK with Gradle...
cd /d "%~dp0frontend\android"
call gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [NOTE] If Gradle failed with 'SDK location not found':
    echo 1. Install Android Studio or Android SDK Command-line Tools.
    echo 2. Set ANDROID_HOME or create frontend\android\local.properties with:
    echo    sdk.dir=C:\\Users\\<Username>\\AppData\\Local\\Android\\Sdk
    echo.
    echo Alternatively, push your code to GitHub to let GitHub Actions build the APK automatically!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ================================================================
echo [SUCCESS] Debug APK generated successfully at:
echo frontend\android\app\build\outputs\apk\debug\app-debug.apk
echo ================================================================
pause
