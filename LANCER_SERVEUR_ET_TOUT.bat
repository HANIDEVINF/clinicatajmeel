@echo off
title Tadjmeel Clinica — Gestionnaire Principal
color 0A

echo ======================================================================
echo           TADJMEEL CLINICA — SUITE LOGICIELLE MÉDICALE
echo ======================================================================
echo.
echo 1. Lancer l'Application RÉCEPTIONNISTE (Accueil, Caisse, Agenda)
echo 2. Lancer l'Application MÉDECIN (Console Soins, Laser, Injections)
echo 3. Lancer le SITE WEB PUBLIC uniquement
echo 4. Démarrer les Serveurs (Backend Python + Frontend Vite)
echo.
set /p choix="Entrez votre choix (1, 2, 3 ou 4) : "

if "%choix%"=="1" goto worker
if "%choix%"=="2" goto doctor
if "%choix%"=="3" goto website
if "%choix%"=="4" goto servers

:worker
start "" LANCER_APPLICATION_RECEPTIONNISTE.bat
exit

:doctor
start "" LANCER_APPLICATION_MEDECIN.bat
exit

:website
start http://localhost:3000
exit

:servers
echo.
echo Demarrage du Backend Flask (port 5000)...
start cmd /k "cd backend && venv\Scripts\activate && python app.py"
timeout /t 2 /nobreak >nul

echo Demarrage du Frontend Vite (port 3000)...
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo Serveurs lances avec succes.
pause
exit
