@echo off
echo ================================================================
echo   GOVERNMENT OF INDIA - DEPARTMENT OF LEGAL METROLOGY (SIH 26036)
echo   Packaging Web Application and Android Project Deliverables
echo ================================================================

if not exist "%~dp0deliverables" mkdir "%~dp0deliverables"

echo [1/3] Building latest React Web production bundle...
cd /d "%~dp0frontend"
call npm run build

echo.
echo [2/3] Creating standalone Web App package (deliverables\web-app-build.zip)...
powershell -Command "Compress-Archive -Path '%~dp0frontend\dist\*' -DestinationPath '%~dp0deliverables\web-app-build.zip' -Force"

echo.
echo [3/3] Creating standalone Android Studio Project package (deliverables\android-app-project.zip)...
powershell -Command "Compress-Archive -Path '%~dp0frontend\android\*', '%~dp0frontend\capacitor.config.json', '%~dp0build-apk.bat' -DestinationPath '%~dp0deliverables\android-app-project.zip' -Force"

echo.
echo ================================================================
echo [SUCCESS] Standalone packages created in the 'deliverables' folder:
echo.
echo 🌐 1. Web Application:
echo    %~dp0deliverables\web-app-build.zip
echo.
echo 📱 2. Android App Project:
echo    %~dp0deliverables\android-app-project.zip
echo ================================================================
pause
