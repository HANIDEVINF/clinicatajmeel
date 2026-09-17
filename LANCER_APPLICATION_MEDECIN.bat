@echo off
title Tadjmeel Clinica — Console Médicale & Paramètres Soins
color 0B

:: Se positionner automatiquement dans le dossier du projet
cd /d "%~dp0"

echo ======================================================================
echo       TADJMEEL CLINICA ALGER — LOGICIEL BUREAU MÉDECIN EXPERT
echo ======================================================================
echo.
echo Lancement de la Console Praticien, Dossiers Soins & Ordonnances...
echo.

:: Vérifier si msedge existe pour lancer en mode Application de Bureau (fenêtre native sans barre d'adresse)
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start "" msedge --app=http://localhost:3000/doctor.html --window-size=1440,900 --window-position=80,80
    exit
)

:: Sinon avec Google Chrome
where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start "" chrome --app=http://localhost:3000/doctor.html --window-size=1440,900 --window-position=80,80
    exit
)

:: Navigateur par défaut en dernier recours
start http://localhost:3000/doctor.html
exit
