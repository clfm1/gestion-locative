@echo off
echo ========================================
echo   LIBERATION DU PORT 3001
echo ========================================
echo.
echo Recherche du processus utilisant le port 3001...
echo.

FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :3001') DO (
    echo Processus trouve avec PID: %%P
    echo Arret du processus...
    taskkill /PID %%P /F
    echo.
    echo Port 3001 libere !
)

echo.
echo ========================================
echo Vous pouvez maintenant relancer le backend
echo Double-cliquez sur : start-backend.bat
echo ========================================
pause
