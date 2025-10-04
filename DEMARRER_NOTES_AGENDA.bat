@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════
echo    📝📅 DÉMARRAGE NOTES ET AGENDA
echo ═══════════════════════════════════════════════
echo.

echo [1/3] Libération du port 3001...
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo    → Processus trouvé : %%a
    taskkill /F /PID %%a >nul 2>&1
)
echo    ✓ Port 3001 libéré !
echo.
timeout /t 2 >nul

echo [2/3] Démarrage du backend...
echo.
start "🔧 BACKEND - Port 3001" cmd /k "cd backend && npm run dev"
echo    ✓ Backend en cours de démarrage...
echo    ⏳ Attendez 5 secondes...
echo.
timeout /t 5 >nul

echo [3/3] Démarrage du frontend...
echo.
start "🎨 FRONTEND - Port 3000" cmd /k "cd frontend && npm run dev"
echo    ✓ Frontend en cours de démarrage...
echo.
timeout /t 3 >nul

echo.
echo ═══════════════════════════════════════════════
echo    ✨ DÉMARRAGE TERMINÉ !
echo ═══════════════════════════════════════════════
echo.
echo 📝 Notes : http://localhost:3000/notes
echo 📅 Agenda : http://localhost:3000/agenda
echo.
echo ⚠️  IMPORTANT : Laissez les 2 fenêtres ouvertes !
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
