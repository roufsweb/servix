#!/bin/bash

# Servix One-Line Installer
# Target: https://raw.githubusercontent.com/roufsweb/servix/main/install.sh

set -e

echo "🚀 Starting Servix One-Line Installer..."

# 1. Install Git if not present
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    pkg update && pkg install git -y
fi

# 2. Clone Servix
echo "📥 Cloning Servix..."
if [ -d "servix" ]; then
    echo "Servix directory already exists. Updating..."
    cd servix
    git pull
else
    git clone https://github.com/roufsweb/servix.git
    cd servix
fi

# 3. Run the Initialization Script
chmod +x servix-init.sh
./servix-init.sh

echo "✅ Servix One-Line Installation Finished!"
