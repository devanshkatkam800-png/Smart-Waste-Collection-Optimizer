@echo off
echo ===================================================
echo Pushing EcoRoute AI to GitHub...
echo Repository: https://github.com/devanshkatkam800-png/Smart-Waste-Collection-Optimizer.git
echo ===================================================

set "GIT_PATH=C:\Users\ravik\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe"

if exist "%GIT_PATH%" (
    "%GIT_PATH%" push -u origin main
) else (
    git push -u origin main
)

echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Successfully pushed to GitHub!
) else (
    echo [NOTE] If prompted, sign in or enter your GitHub Personal Access Token.
)
pause
