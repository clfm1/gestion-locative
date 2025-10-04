@echo off
echo ========================================
echo Demarrage du Backend
echo ========================================
cd backend
echo Installation des dependances...
call npm install
echo.
echo Generation des fichiers Prisma...
call npx prisma generate
echo.
echo Migration de la base de donnees...
call npx prisma migrate dev --name init
echo.
echo Demarrage du serveur...
call npm run dev
