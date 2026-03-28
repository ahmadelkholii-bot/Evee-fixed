@echo off
chcp 65001 >nul
cls

echo ==========================================
echo   Eve Clinic - Firebase Deployment
echo ==========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI not found!
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
    
    firebase --version >nul 2>&1
    if errorlevel 1 (
        echo Failed to install Firebase CLI.
        echo Please install manually: npm install -g firebase-tools
        pause
        exit /b 1
    )
)

echo [OK] Firebase CLI is installed

REM Check if user is logged in
echo.
echo Checking Firebase authentication...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo You need to login to Firebase
    echo A browser window will open. Please login with: ahmadelkholii@gmail.com
    firebase login
)

echo [OK] Firebase authentication verified

REM Check if firebase.json exists
if not exist "firebase.json" (
    echo.
    echo Firebase not initialized in this project
    echo Running firebase init...
    echo Please follow the prompts:
    echo   1. Select 'Firestore' and 'Hosting'
    echo   2. Choose your 'eve-clinic' project
    echo   3. Accept defaults for other options
    echo.
    firebase init
)

echo [OK] Firebase configuration found

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo Failed to install dependencies
    echo Trying to fix...
    rmdir /s /q node_modules
    del package-lock.json
    call npm install
)

echo [OK] Dependencies installed

REM Build the project
echo.
echo Building the project...
call npm run build

if errorlevel 1 (
    echo [ERROR] Build failed!
    echo Please check the error messages above
    pause
    exit /b 1
)

echo [OK] Build successful

REM Check if dist folder exists
if not exist "dist" (
    echo [ERROR] dist folder not found!
    echo Build may have failed. Please check the output above.
    pause
    exit /b 1
)

echo [OK] dist folder created

REM Deploy to Firebase
echo.
echo ==========================================
echo   Deploying to Firebase...
echo ==========================================
echo.

firebase deploy

if errorlevel 1 (
    echo.
    echo ==========================================
    echo   Deployment Failed
    echo ==========================================
    echo.
    echo Please check the error messages above
    echo.
    echo Common fixes:
    echo   1. Make sure you're logged in: firebase login
    echo   2. Check your firebase.json configuration
    echo   3. Verify your Firebase project exists
    echo.
) else (
    echo.
    echo ==========================================
    echo   Deployment Successful!
    echo ==========================================
    echo.
    echo Your Eve Clinic app is now live!
    echo.
    echo Get your hosting URL from the output above
    echo It will look like: https://your-project-id.web.app
    echo.
)

pause
