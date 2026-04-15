#!/bin/bash
# Navidrome Install Script for Servix

set -e

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/navidrome/navidrome/releases/latest/download/navidrome_linux_arm64.tar.gz"
else
    URL="https://github.com/navidrome/navidrome/releases/latest/download/navidrome_linux_amd64.tar.gz"
fi

echo "📥 Downloading Navidrome..."
curl -L "$URL" -o navidrome.tar.gz

echo "📦 Extracting..."
tar -xf navidrome.tar.gz navidrome
rm navidrome.tar.gz
chmod +x navidrome

echo "✅ Navidrome installed."
