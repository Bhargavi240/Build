@echo off
cd /d "%~dp0"

echo ========================================================
echo Checking Git installation...
echo ========================================================
git --version
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git is not installed on your computer!
    pause
    exit /b 1
)

echo.
echo ========================================================
echo [1/4] Preparing Git branch and staging files...
echo ========================================================
git branch -M main
git add -A
git commit -m "Upload BuildStock project" 2>nul

echo.
echo ========================================================
echo [2/4] Setting remote repository to Bhargavi240/Build...
echo ========================================================
git remote remove origin 2>nul
git remote add origin https://github.com/Bhargavi240/Build.git
git remote -v

echo.
echo ========================================================
echo [3/4] Pushing files to GitHub...
echo (If a browser window opens, click "Sign in with browser")
echo ========================================================
git push -u origin main --force

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo SUCCESS! Your project is now uploaded to:
    echo https://github.com/Bhargavi240/Build
) else (
    echo PUSH FAILED! Please verify your repository URL or permissions.
)
echo ========================================================
pause
