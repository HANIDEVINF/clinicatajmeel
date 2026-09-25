@echo off
title Tadjmeel Clinica — Application Réceptionniste & Caisse
color 0E

:: Se positionner automatiquement dans le dossier du projet
cd /d "%~dp0"

echo ======================================================================
echo       TADJMEEL CLINICA ALGER — LOGICIEL BUREAU RÉCEPTIONNISTE
echo ======================================================================
echo.
echo Lancement de l'espace Accueil, Agenda, Caisse et Dossiers Patientes...
echo.

:: Vérifier si msedge existe pour lancer en mode Application de Bureau (fenêtre native sans barre d'adresse)
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start "" msedge --app=http://localhost:3000/worker.html --window-size=1440,900 --window-position=50,50
    exit
)

:: Sinon avec Google Chrome
where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start "" chrome --app=http://localhost:3000/worker.html --window-size=1440,900 --window-position=50,50
    exit
)

:: Navigateur par défaut en dernier recours
start http://localhost:3000/worker.html
exit
