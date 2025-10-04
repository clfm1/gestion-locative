@echo off
echo ========================================
echo Demarrage du Frontend
echo ========================================
cd frontend
echo Installation des dependances...
call npm install
echo.
echo Demarrage de l'application...
call npm run dev
