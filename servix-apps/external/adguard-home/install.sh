#!/bin/bash
# AdGuard Home Install Script for Servix

set -e

APP_DIR=$(pwd)
ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://static.adguard.com/adguardhome/release/AdGuardHome_linux_arm64.tar.gz"
else
    # Development/PC fallback
    URL="https://static.adguard.com/adguardhome/release/AdGuardHome_linux_amd64.tar.gz"
fi

echo "📥 Downloading AdGuard Home..."
curl -L "$URL" -o adguard.tar.gz

echo "📦 Extracting..."
tar -xf adguard.tar.gz --strip-components=1
rm adguard.tar.gz

echo "✅ AdGuard Home installed."
