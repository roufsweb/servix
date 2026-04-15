#!/bin/bash

# Servix Uninstaller
# This script will remove the Ubuntu environment and all Servix files.

echo "⚠️ WARNING: This will completely remove Servix and the Ubuntu proot environment."
read -p "Are you sure you want to proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Uninstallation cancelled."
    exit 1
fi

echo "🛑 Stopping services (if any)..."
# Stop PM2 inside proot
proot-distro login ubuntu -- bash -c "pm2 delete all && pm2 kill" || true
pkill -f "node" || true

echo "🔋 Releasing Wake Lock..."
termux-wake-unlock || true

echo "🧹 Removing Ubuntu proot..."
proot-distro remove ubuntu

echo "📂 Deleting Servix project files..."
cd ..
rm -rf servix

echo "✅ Servix has been uninstalled."
