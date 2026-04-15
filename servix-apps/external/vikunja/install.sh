#!/bin/bash
# Vikunja Install Script for Servix

set -e

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://dl.vikunja.io/vikunja/latest/vikunja-latest-linux-arm64"
else
    URL="https://dl.vikunja.io/vikunja/latest/vikunja-latest-linux-amd64"
fi

echo "📥 Downloading Vikunja..."
curl -L "$URL" -o vikunja
chmod +x vikunja

echo "✅ Vikunja installed."
