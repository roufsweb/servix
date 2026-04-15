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
# In a proot environment, we just need to kill the processes
pkill -f "node" || true

echo "🧹 Removing Ubuntu proot..."
proot-distro remove ubuntu

echo "📂 Deleting Servix project files..."
cd ..
rm -rf servix

echo "✅ Servix has been uninstalled."
