@echo off
setlocal enabledelayedexpansion
title BuildStock - Inventory and Sales Server
cd /d "%~dp0"
cls

echo ===================================================================
echo     BuildStock - Inventory and Sales Management System
echo ===================================================================
echo.

:: 1. Check Node.js
for /d %%D in ("%USERPROFILE%\.nodejs\node*") do (
    if exist "%%D\node.exe" set "PATH=%%D;%PATH%"
)
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed or not found in PATH!
    echo.
    echo Please install Node.js:
    echo 1. Download from https://nodejs.org/ (LTS version)
    echo 2. Run the installer and complete setup.
    echo 3. Restart your terminal or double-click run.bat again.
    echo.
    pause
    exit /b 1
)

:: 2. Determine local IP address for mobile connection
set "LOCAL_IP="
for /f "tokens=4" %%a in ('route print ^| findstr "\<0.0.0.0\>"') do (
    if not defined LOCAL_IP set "LOCAL_IP=%%a"
)
if "%LOCAL_IP%"=="" (
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
        if not defined LOCAL_IP (
            for /f "tokens=1" %%b in ("%%a") do set "LOCAL_IP=%%b"
        )
    )
)

:: 3. Install dependencies if node_modules missing
if not exist "node_modules" (
    echo [1/2] Installing dependencies for first-time setup...
    echo (This takes 30-60 seconds, please wait...)
    call npm install --no-audit --no-fund
    if %errorlevel% neq 0 (
        echo.
        echo [!] First attempt had warnings, resetting lockfile and retrying...
        del /f /q package-lock.json 2>nul
        call npm install --legacy-peer-deps --no-audit --no-fund
    )
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] npm install encountered an error.
        echo You can also simply double-click "app.html" in this folder to run instantly!
        pause
        exit /b 1
    )
    echo [1/2] Dependencies installed successfully!
) else (
    echo [1/2] Dependencies verified.
)

:: 4. Start Vite development server
echo.
echo [2/2] Starting Development Server...
echo ===================================================================
echo   COMPUTER ACCESS:
echo     --^> http://localhost:5174
echo.
if not "%LOCAL_IP%"=="" (
    echo   MOBILE PHONE ACCESS (connect phone to same Wi-Fi):
    echo     --^> http://!LOCAL_IP!:5174
) else (
    echo   MOBILE PHONE ACCESS:
    echo     --^> Look at the "Network:" address printed by Vite below
)
echo ===================================================================
echo.
echo Note: Keep this window OPEN while using BuildStock.
echo.

:: Open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5174"

:: Run Vite
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [SERVER STOPPED OR ENCOUNTERED AN ERROR]
    pause
)
