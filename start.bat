@echo off
echo ========================================
echo    Bot do Discord - Brawlhalla
echo ========================================
echo.
echo Verificando se o arquivo .env existe...
if not exist ".env" (
    echo.
    echo ❌ Arquivo .env não encontrado!
    echo.
    echo Por favor, copie o arquivo env.example para .env
    echo e configure suas credenciais:
    echo.
    echo 1. Copie: copy env.example .env
    echo 2. Edite o arquivo .env com suas credenciais
    echo 3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

echo ✅ Arquivo .env encontrado!
echo.
echo Iniciando o bot...
echo.
npm start
pause 