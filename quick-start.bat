@echo off
REM ========================================
REM MAD(wo)MEN dNFT Ticketing System
REM Quick Start Script (Windows)
REM ========================================

echo 🚀 MAD(wo)MEN dNFT Ticketing System - Quick Start
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo ✅ npm detected

REM Install backend dependencies
echo 📦 Installing backend dependencies...
npm install

REM Install additional required packages
echo 📦 Installing additional packages...
npm install nodemon cors helmet express-rate-limit

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Create environment file if it doesn't exist
if not exist .env (
    echo ⚙️  Creating environment file...
    copy env.template .env
    echo ✅ Environment file created. Please edit .env with your configuration.
) else (
    echo ✅ Environment file already exists.
)

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start backend: npm run dev
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo.
echo For detailed instructions, see SETUP.md
echo.
echo Happy coding! 🚀✨
pause 