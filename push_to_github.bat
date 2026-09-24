@echo off
setlocal enabledelayedexpansion
cls
echo ===================================================================
echo   Pushing Project to: https://github.com/Bhargavi240/Build
echo ===================================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    pause
    exit /b 1
)

echo [1/4] Initializing Git repository...
if not exist ".git" (
    git init
)
git branch -M main

echo.
echo [2/4] Staging all project files...
git add .

echo [3/4] Committing project files...
git commit -m "BuildStock complete application" 2>nul

echo.
echo [4/4] Connecting to remote and pushing...
git remote remove origin 2>nul
git remote add origin https://github.com/Bhargavi240/Build.git
git push -u origin main --force

echo.
echo ===================================================================
echo Done! Check your repository: https://github.com/Bhargavi240/Build
echo ===================================================================
pause
