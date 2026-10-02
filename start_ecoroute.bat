@echo off
echo ========================================================
echo   EcoRoute AI - Smart Waste Collection Optimizer
echo ========================================================
echo.
cd /d "%~dp0"
echo Starting production server at http://localhost:3000...
cmd /c npm.cmd start
pause
