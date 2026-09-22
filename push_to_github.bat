@echo off
setlocal enabledelayedexpansion
cls
echo ===================================================================
echo   Pushing Project to: https://github.com/Bhargavi240/build-stock
echo ===================================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [1/4] Initializing Git repository...
if not exist ".git" (
    git init
)
git branch -M main

echo.
echo [2/4] Staging all project files (excluding node_modules)...
git add .

echo [3/4] Committing project files...
git config user.email >nul 2>nul || git config user.email "buildstock@example.com"
git config user.name >nul 2>nul || git config user.name "BuildStock Developer"
git commit -m "Update BuildStock: full App.jsx, mobile view, and Cloudflare config"

echo.
echo [4/4] Connecting to remote and pushing...
git remote remove origin 2>nul
git remote add origin https://github.com/Bhargavi240/build-stock.git
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ------------------------------------------------------------------
    echo Notice: Push was rejected or branch diverged. Attempting force push...
    echo ------------------------------------------------------------------
    git push -u origin main --force
)

echo.
echo ===================================================================
echo Done! Check your repository: https://github.com/Bhargavi240/build-stock
echo ===================================================================
pause
