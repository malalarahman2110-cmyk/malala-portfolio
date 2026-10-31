@echo off
title Mahmuda Khatun Portfolio - Local Web Server
echo ========================================================
echo   Mahmuda Khatun (Malala) - Personal Portfolio Server
echo ========================================================
echo.
echo Starting local web server on port 3000...
echo Opening portfolio in your default web browser...
echo.

cd /d "%~dp0"
start http://localhost:3000

python -m http.server 3000
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Python server terminated. Trying Node npx serve...
    npx serve -p 3000 .
)
pause

