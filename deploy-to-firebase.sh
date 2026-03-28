#!/bin/bash

# Eve Clinic - Firebase Deployment Script
# This script automates the deployment process
# Usage: ./deploy-to-firebase.sh

echo "=========================================="
echo "  Eve Clinic - Firebase Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Firebase CLI not found!${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    
    if ! command -v firebase &> /dev/null; then
        echo -e "${RED}Failed to install Firebase CLI.${NC}"
        echo "Please install manually: npm install -g firebase-tools"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Firebase CLI is installed${NC}"

# Check if user is logged in
echo ""
echo "Checking Firebase authentication..."
firebase projects:list > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}You need to login to Firebase${NC}"
    echo "A browser window will open. Please login with: ahmadelkholii@gmail.com"
    firebase login
fi

echo -e "${GREEN}✓ Firebase authentication verified${NC}"

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    echo ""
    echo -e "${YELLOW}Firebase not initialized in this project${NC}"
    echo "Running firebase init..."
    echo "Please follow the prompts:"
    echo "  1. Select 'Firestore' and 'Hosting'"
    echo "  2. Choose your 'eve-clinic' project"
    echo "  3. Accept defaults for other options"
    echo ""
    firebase init
fi

echo -e "${GREEN}✓ Firebase configuration found${NC}"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies${NC}"
    echo "Trying to fix..."
    rm -rf node_modules package-lock.json
    npm install
fi

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Build the project
echo ""
echo "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    echo "Please check the error messages above"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${RED}dist folder not found!${NC}"
    echo "Build may have failed. Please check the output above."
    exit 1
fi

echo -e "${GREEN}✓ dist folder created${NC}"

# Deploy to Firebase
echo ""
echo "=========================================="
echo "  Deploying to Firebase..."
echo "=========================================="
echo ""

firebase deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo -e "${GREEN}  Deployment Successful! 🎉${NC}"
    echo "=========================================="
    echo ""
    echo "Your Eve Clinic app is now live!"
    echo ""
    echo "Get your hosting URL from the output above"
    echo "It will look like: https://your-project-id.web.app"
    echo ""
else
    echo ""
    echo "=========================================="
    echo -e "${RED}  Deployment Failed${NC}"
    echo "=========================================="
    echo ""
    echo "Please check the error messages above"
    echo ""
    echo "Common fixes:"
    echo "  1. Make sure you're logged in: firebase login"
    echo "  2. Check your firebase.json configuration"
    echo "  3. Verify your Firebase project exists"
    echo ""
fi
