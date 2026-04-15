#!/bin/bash
# Jellyfin Start Script for Servix

APP_DIR=$(dirname "$0")
DATA_DIR="$APP_DIR/data"
CONFIG_DIR="$APP_DIR/config"
LOG_DIR="$APP_DIR/log"

mkdir -p "$DATA_DIR" "$CONFIG_DIR" "$LOG_DIR"

echo "🚀 Starting Jellyfin..."
./jellyfin \
  --datadir "$DATA_DIR" \
  --configdir "$CONFIG_DIR" \
  --logdir "$LOG_DIR" \
  --cachedir "$DATA_DIR/cache" \
  --ffmpeg /usr/bin/ffmpeg
