@echo off
echo ========================================
echo    COPIE DU LOGO OCCAZCAR
echo ========================================
echo.

echo 🔄 Copie du logo de la plateforme...

REM Vérifier si le logo source existe
if not exist "src\Assets\logo.png" (
    echo ❌ Logo source non trouvé : src\Assets\logo.png
    pause
    exit /b 1
)

echo ✅ Logo source trouvé

REM Copier le logo vers le dossier public
copy "src\Assets\logo.png" "public\logo.png"

echo ✅ Logo copié vers public\logo.png

echo.
echo 🎉 Votre logo OccazCar est maintenant configuré partout !
echo.
echo 💡 Conseil : Redémarrez votre serveur de développement
echo.
pause
