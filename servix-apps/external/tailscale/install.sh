#!/bin/bash
# Tailscale Install Script for Servix

set -e

ARCH=$(uname -m)
if [ "$ARCH" == "aarch64" ]; then
    URL="https://pkgs.tailscale.com/stable/tailscale_1.62.1_arm64.tgz"
else
    # Fallback to amd64 for development
    URL="https://pkgs.tailscale.com/stable/tailscale_1.62.1_amd64.tgz"
fi

echo "📥 Downloading Tailscale..."
curl -L "$URL" -o tailscale.tgz

echo "📦 Extracting..."
tar -xf tailscale.tgz --strip-components=1
rm tailscale.tgz
chmod +x tailscale tailscaled

echo "✅ Tailscale binaries ready."
