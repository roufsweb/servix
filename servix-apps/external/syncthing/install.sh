#!/bin/bash
# Syncthing Install Script for Servix

set -e

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/syncthing/syncthing/releases/latest/download/syncthing-linux-arm64-v1.27.5.tar.gz"
else
    URL="https://github.com/syncthing/syncthing/releases/latest/download/syncthing-linux-amd64-v1.27.5.tar.gz"
fi

echo "📥 Downloading Syncthing..."
curl -L "$URL" -o syncthing.tar.gz

echo "📦 Extracting..."
tar -xf syncthing.tar.gz --strip-components=1 syncthing-linux-arm64-v1.27.5/syncthing || tar -xf syncthing.tar.gz --strip-components=1
rm syncthing.tar.gz
chmod +x syncthing

echo "✅ Syncthing installed."
