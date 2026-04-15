#!/bin/bash
# Beszel Install Script for Servix

set -e

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/henrygd/beszel/releases/latest/download/beszel_linux_arm64.tar.gz"
else
    URL="https://github.com/henrygd/beszel/releases/latest/download/beszel_linux_amd64.tar.gz"
fi

echo "📥 Downloading Beszel..."
curl -L "$URL" -o beszel.tar.gz

echo "📦 Extracting..."
tar -xf beszel.tar.gz beszel
rm beszel.tar.gz
chmod +x beszel

echo "✅ Beszel installed."
