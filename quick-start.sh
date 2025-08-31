#!/bin/bash

# ========================================
# MAD(wo)MEN dNFT Ticketing System
# Quick Start Script
# ========================================

echo "🚀 MAD(wo)MEN dNFT Ticketing System - Quick Start"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $(node -v) is too old. Please install Node.js v18+"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install additional required packages
echo "📦 Installing additional packages..."
npm install nodemon cors helmet express-rate-limit

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating environment file..."
    cp env.template .env
    echo "✅ Environment file created. Please edit .env with your configuration."
else
    echo "✅ Environment file already exists."
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start backend: npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
echo "Happy coding! 🚀✨" 