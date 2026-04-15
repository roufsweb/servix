#!/bin/bash
# Jellyfin Install Script for Servix (Ubuntu proot)

set -e

APP_DIR=$(pwd)
VERSION="10.8.13"
ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://repo.jellyfin.org/releases/server/linux/stable/combined/jellyfin_${VERSION}_arm64.tar.gz"
else
    # Fallback/Development (likely x86_64)
    URL="https://repo.jellyfin.org/releases/server/linux/stable/combined/jellyfin_${VERSION}_amd64.tar.gz"
fi

echo "📥 Downloading Jellyfin ${VERSION}..."
curl -L "$URL" -o jellyfin.tar.gz

echo "📦 Extracting..."
tar -xf jellyfin.tar.gz --strip-components=1
rm jellyfin.tar.gz

echo "✅ Jellyfin installed in $APP_DIR"
