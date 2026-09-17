@echo off
title Tadjmeel Clinica — Electron Médecin
color 0B

:: Se positionner automatiquement dans le dossier du projet
cd /d "%~dp0"

echo ======================================================================
echo       LANCEMENT TADJMEEL CLINICA MÉDECIN AVEC ELECTRON
echo ======================================================================
echo.
npx electron desktop/main.cjs --app=doctor
pause
