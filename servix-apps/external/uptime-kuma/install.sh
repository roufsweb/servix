#!/bin/bash
# Uptime Kuma Install Script for Servix

set -e

echo "📥 Cloning Uptime Kuma..."
git clone https://github.com/louislam/uptime-kuma.git .
npm run setup

echo "✅ Uptime Kuma installed."
