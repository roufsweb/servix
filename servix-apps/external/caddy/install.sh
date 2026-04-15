#!/bin/bash
# Caddy Install Script for Servix

set -e

ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/caddyserver/caddy/releases/latest/download/caddy_linux_arm64.tar.gz"
else
    URL="https://github.com/caddyserver/caddy/releases/latest/download/caddy_linux_amd64.tar.gz"
fi

echo "📥 Downloading Caddy..."
curl -L "$URL" -o caddy.tar.gz

echo "📦 Extracting..."
tar -xf caddy.tar.gz caddy
rm caddy.tar.gz
chmod +x caddy

echo "✅ Caddy installed."
