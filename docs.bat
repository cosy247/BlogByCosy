@echo off
set "DIR=%~dp0"
cd /d "%DIR%" >nul 2>&1

if "%1"=="list" (
    npm run list
) else if "%1"=="new" (
    npm run new
) else if "%1"=="file" (
    explorer.exe . 
) else if "%1"=="cmd" ( 
    cmd.exe /k cd "%DIR%" 
) else (
    echo Usage: docs [list ^| new ^| file ^| cmd]
    echo   list - Execute npm run list
    echo   new  - Execute npm run new
    echo   file - Open file explorer in current directory
    echo   cmd  - Open CMD window in current directory
)
