@echo off
title Tadjmeel Clinica — Electron Réceptionniste
color 0E

:: Se positionner automatiquement dans le dossier du projet
cd /d "%~dp0"

echo ======================================================================
echo    LANCEMENT TADJMEEL CLINICA RÉCEPTIONNISTE AVEC ELECTRON
echo ======================================================================
echo.
npx electron desktop/main.cjs --app=worker
pause
