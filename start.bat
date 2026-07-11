@echo off
echo =========================================
echo       Starting Recipe Maker AI...
echo =========================================

echo.
echo Starting Backend Server...
start "RecipeAI Backend" cmd /k "cd backend && call .venv\Scripts\activate && uvicorn main:app --reload"

echo.
echo Starting Frontend Development Server...
start "RecipeAI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo You can close this window now.
