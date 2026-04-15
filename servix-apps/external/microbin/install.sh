#!/bin/bash
# Microbin Install Script for Servix

set -e

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/szabodanika/microbin/releases/latest/download/microbin-linux-arm64"
else
    URL="https://github.com/szabodanika/microbin/releases/latest/download/microbin-linux-amd64"
fi

echo "📥 Downloading Microbin..."
curl -L "$URL" -o microbin
chmod +x microbin

echo "✅ Microbin installed."
