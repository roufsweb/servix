#!/bin/bash
# Gotify Install Script for Servix

set -e

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/gotify/server/releases/latest/download/gotify-linux-arm64.zip"
else
    URL="https://github.com/gotify/server/releases/latest/download/gotify-linux-amd64.zip"
fi

echo "📥 Downloading Gotify..."
curl -L "$URL" -o gotify.zip

echo "📦 Extracting..."
unzip -o gotify.zip
rm gotify.zip
chmod +x gotify-linux-arm64 || chmod +x gotify-linux-amd64

echo "✅ Gotify installed."
