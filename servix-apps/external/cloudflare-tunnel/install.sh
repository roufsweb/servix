#!/bin/bash
# Cloudflare Tunnel Install Script

set -e
ARCH=$(uname -m)

if [ "$ARCH" == "aarch64" ]; then
    URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64"
else
    URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
fi

echo "📥 Downloading cloudflared..."
curl -L "$URL" -o cloudflared
chmod +x cloudflared

echo "✅ Cloudflare Tunnel installed."
