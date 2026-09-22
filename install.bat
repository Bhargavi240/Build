@echo off
cd /d "%~dp0"
for /d %%D in ("%USERPROFILE%\.nodejs\node*") do (
    if exist "%%D\node.exe" set "PATH=%%D;%PATH%"
)
echo ===================================================
echo   Installing BuildStock Dependencies...
echo ===================================================
call npm.cmd install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo [!] Retrying clean install...
    del /f /q package-lock.json 2>nul
    call npm.cmd install --legacy-peer-deps --no-audit --no-fund
)
echo.
echo ===================================================
echo   Starting Vite Server...
echo ===================================================
start http://localhost:5174
call npm.cmd run dev
pause
