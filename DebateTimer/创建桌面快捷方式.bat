@echo off
title Debate Timer - Setup Shortcut
echo.
echo   Creating desktop shortcut...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_shortcut.ps1"
echo.
echo   All done. Please check your desktop.
echo.
pause