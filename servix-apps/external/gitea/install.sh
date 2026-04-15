#!/bin/bash
# Gitea Install Script for Servix

set -e

APP_DIR=$(pwd)
VERSION="1.21.7"
ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/go-gitea/gitea/releases/download/v${VERSION}/gitea-${VERSION}-linux-arm64"
else
    URL="https://github.com/go-gitea/gitea/releases/download/v${VERSION}/gitea-${VERSION}-linux-amd64"
fi

echo "📥 Downloading Gitea ${VERSION}..."
curl -L "$URL" -o gitea
chmod +x gitea

echo "✅ Gitea installed."
