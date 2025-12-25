@echo off
REM Sales Overview - Git Bash Quick Launch
REM This batch file opens Git Bash in the project directory

REM Get the current directory
set PROJECT_DIR=%~dp0

REM Open Git Bash here
start "" "C:\Program Files\Git\git-bash.exe" --cd="%PROJECT_DIR%"

REM Alternative if the above path doesn't work:
REM start "" "C:\Program Files (x86)\Git\git-bash.exe" --cd="%PROJECT_DIR%"

echo.
echo Opening Git Bash in: %PROJECT_DIR%
echo.
echo Available commands:
echo   npm run dev           - Start development server
echo   npm run build         - Build for production
echo   git status            - Check Git status
echo   git log               - View commit history
echo.
