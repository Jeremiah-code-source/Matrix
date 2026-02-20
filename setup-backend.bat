@echo off
echo ========================================
echo Birthday Video Page - Backend Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Node.js detected...
echo.

:: Install dependencies
echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

:: Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [3/5] Vercel CLI not found. Installing...
    call npm install -g vercel
) else (
    echo [3/5] Vercel CLI already installed...
)
echo.

:: Deploy to Vercel
echo [4/5] Deploying to Vercel...
echo Please follow the prompts:
echo - Login to your Vercel account
echo - Accept default settings (press Enter)
echo.
call vercel
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)
echo.

:: Get deployment URL
echo [5/5] Deployment complete!
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Copy the deployment URL from above
echo    (looks like: https://matrix-abc123.vercel.app)
echo.
echo 2. Open config.js in a text editor
echo.
echo 3. Update these lines:
echo    USE_BACKEND: true,
echo    BACKEND_URL: 'YOUR_COPIED_URL',
echo.
echo 4. Save config.js
echo.
echo 5. Run this script again to deploy frontend
echo    OR commit and push to GitHub
echo.
echo ========================================
pause
