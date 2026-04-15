#!/bin/bash
# ntfy Install Script for Servix

set -e

ARCH=$(uname -m)
VERSION="2.11.0"

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/binwiederhier/ntfy/releases/download/v${VERSION}/ntfy_${VERSION}_linux_arm64.tar.gz"
else
    URL="https://github.com/binwiederhier/ntfy/releases/download/v${VERSION}/ntfy_${VERSION}_linux_amd64.tar.gz"
fi

echo "📥 Downloading ntfy ${VERSION}..."
curl -L "$URL" -o ntfy.tar.gz

echo "📦 Extracting..."
tar -xf ntfy.tar.gz --strip-components=1
rm ntfy.tar.gz

echo "✅ ntfy installed."
