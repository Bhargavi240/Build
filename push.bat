@echo off
cd /d "%~dp0"

echo ========================================================
echo Checking Git installation...
echo ========================================================
git --version
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git is not installed on your computer!
    echo Please download and install Git from: https://git-scm.com/download/win
    echo After installing, restart VS Code.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo [1/5] Initializing Git in Project directory...
echo ========================================================
git init
git branch -M main

echo.
echo ========================================================
echo [2/5] Adding all files to Git...
echo ========================================================
git add -A

echo.
echo ========================================================
echo [3/5] Committing files...
echo ========================================================
git commit -m "Upload BuildStock project"

echo.
echo ========================================================
echo [4/5] Setting remote repository URL...
echo ========================================================
git remote remove origin 2>nul
git remote add origin https://github.com/PamarthiBhargavi/build-stockkk.git
git remote -v

echo.
echo ========================================================
echo [5/5] Pushing files to GitHub...
echo (If a browser window opens, click "Sign in with browser")
echo ========================================================
git push -u origin main --force

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo SUCCESS! Your project is now uploaded to:
    echo https://github.com/Bhargavi240/build-stock
) else (
    echo PUSH FAILED! Please read the error message above.
)
echo ========================================================
pause
