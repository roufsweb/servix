#!/bin/bash
# FileBrowser Install Script for Servix

set -e

APP_DIR=$(pwd)
ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/filebrowser/filebrowser/releases/latest/download/linux-arm64-filebrowser.tar.gz"
else
    URL="https://github.com/filebrowser/filebrowser/releases/latest/download/linux-amd64-filebrowser.tar.gz"
fi

echo "📥 Downloading FileBrowser..."
curl -L "$URL" -o filebrowser.tar.gz

echo "📦 Extracting..."
tar -xf filebrowser.tar.gz
rm filebrowser.tar.gz

echo "✅ FileBrowser installed."
