@echo off
setlocal
title BuildStock - Push with GitHub Token

cd /d "C:\Users\hp\Desktop\build-stock-main"

echo ========================================================
echo   Push to GitHub using Personal Access Token (PAT)
echo ========================================================
echo.
echo Step 1: Open this link to create a token:
echo         https://github.com/settings/tokens/new
echo.
echo Step 2: Set Note to: BuildStock
echo         Check the box for: [x] repo (Full control)
echo         Click "Generate token" at the bottom
echo.
echo Step 3: Copy the token (starts with ghp_...)
echo ========================================================
echo.
set /p GITHUB_TOKEN="Paste your GitHub Token here and press Enter: "

if "%GITHUB_TOKEN%"=="" (
    echo [ERROR] Token cannot be empty.
    pause
    exit /b 1
)

echo.
echo [1/2] Staging and committing files...
git branch -M main
git add -A
git commit -m "Upload BuildStock project" 2>nul

echo.
echo [2/2] Pushing to https://github.com/Bhargavi240/Build.git ...
git push https://%GITHUB_TOKEN%@github.com/Bhargavi240/Build.git main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo SUCCESS! Your project has been pushed to:
    echo https://github.com/Bhargavi240/Build
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo PUSH FAILED! Please check:
    echo 1. Your token has the 'repo' permission checked.
    echo 2. The repo exists at https://github.com/Bhargavi240/Build
    echo ========================================================
)

pause
