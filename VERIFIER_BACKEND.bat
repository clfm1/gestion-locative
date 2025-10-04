@echo off
echo ========================================
echo   VERIFICATION DU BACKEND
echo ========================================
echo.
echo Tentative de connexion au backend...
echo.

curl http://localhost:3001/api/health

echo.
echo.
echo ========================================
echo.
echo Si vous voyez {"status":"ok",...} : LE BACKEND FONCTIONNE
echo Si vous voyez "Failed to connect" : LE BACKEND NE TOURNE PAS
echo.
echo ========================================
pause
