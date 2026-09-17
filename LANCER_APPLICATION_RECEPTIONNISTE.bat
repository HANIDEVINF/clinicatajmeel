@echo off
title Tadjmeel Clinica — Application Réceptionniste & Caisse
color 0E

echo ======================================================================
echo       TADJMEEL CLINICA ALGER — LOGICIEL BUREAU RÉCEPTIONNISTE
echo ======================================================================
echo.
echo Lancement de l'espace Accueil, Agenda, Caisse et Dossiers Patientes...
echo.

:: Vérifier si le serveur Vite tourne sur le port 3000
timeout /t 1 /nobreak >nul

:: Tenter de lancer en mode Application autonome (sans barre d'adresse) avec Microsoft Edge (présent sur 100% des Windows 10/11)
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start "" msedge --app=http://localhost:3000/worker.html --window-size=1400,900 --window-position=50,50
    exit
)

:: Sinon tenter Google Chrome
where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start "" chrome --app=http://localhost:3000/worker.html --window-size=1400,900 --window-position=50,50
    exit
)

:: Navigateur par défaut en dernier recours
start http://localhost:3000/worker.html
exit
