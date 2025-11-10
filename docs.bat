@echo off
set "DIR=%~dp0"
cd /d "%DIR%" >nul 2>&1

if "%1%2"=="list" (
    npm run list
) else if "%1%2"=="new" (
    npm run new
) else (
    echo 用法: docs [docs list ^| docs new]
)
