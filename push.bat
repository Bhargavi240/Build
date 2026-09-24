@echo off
setlocal enabledelayedexpansion
title BuildStock - Push to GitHub

:: 1. Verify and navigate to project directory
set "TARGET_DIR=C:\Users\hp\Desktop\build-stock-main"

if not exist "!TARGET_DIR!" (
    echo [ERROR] Target directory not found: !TARGET_DIR!
    pause
    exit /b 1
)

cd /d "!TARGET_DIR!"
echo ========================================================
echo [INFO] Working directory verified:
echo %CD%
echo ========================================================

:: 2. Verify Git installation
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in system PATH!
    pause
    exit /b 1
)

:: 3. Ensure branch is main
git branch -M main

:: 4. Verify and configure remote origin URL
set "EXPECTED_REMOTE=https://github.com/Bhargavi240/Build.git"
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Adding remote origin: !EXPECTED_REMOTE!
    git remote add origin !EXPECTED_REMOTE!
) else (
    echo [INFO] Setting remote origin to: !EXPECTED_REMOTE!
    git remote set-url origin !EXPECTED_REMOTE!
)

echo [INFO] Remote URL verified:
git remote get-url origin
echo ========================================================

:: 5. Stage all changes
echo.
echo [1/4] Staging project files...
git add -A

:: 6. Commit if there are changes
echo.
echo [2/4] Checking for changes to commit...
git status --porcelain | findstr . >nul 2>nul
if %errorlevel% equ 0 (
    git commit -m "Upload BuildStock project"
    echo [INFO] Committed new changes.
) else (
    echo [INFO] Working tree is clean, no new changes to commit.
)

:: 7. Check GitHub Authentication via Git Credential Manager
echo.
echo [3/4] Checking GitHub authentication status...
set "GCM_EXE=C:\Program Files\Git\mingw64\bin\git-credential-manager.exe"
set "LOGGED_IN="

if exist "!GCM_EXE!" (
    for /f "tokens=*" %%a in ('"!GCM_EXE!" github list 2^>nul') do (
        set "LOGGED_IN=%%a"
    )
)

if not defined LOGGED_IN (
    echo.
    echo ========================================================
    echo Starting GitHub browser sign-in...
    echo Your default web browser will open in a moment.
    echo Please click "Authorize GitCredentialManager" for Bhargavi240.
    echo ========================================================
    if exist "!GCM_EXE!" (
        "!GCM_EXE!" github login --browser
        if !errorlevel! neq 0 (
            echo.
            echo [!] Browser sign-in was not completed or closed.
            echo [!] Switching to Device Code sign-in:
            echo Please visit: https://github.com/login/device
            "!GCM_EXE!" github login --device
        )
    )
) else (
    echo [INFO] Already signed in to GitHub as: !LOGGED_IN!
)

:: 8. Push to GitHub
echo.
echo [4/4] Pushing to GitHub (main branch)...
echo ========================================================
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo SUCCESS: Project successfully pushed to:
    echo https://github.com/Bhargavi240/Build
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo PUSH FAILED!
    echo If your repository is new, make sure it exists at:
    echo https://github.com/Bhargavi240/Build
    echo ========================================================
)

pause
