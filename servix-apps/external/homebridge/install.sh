#!/bin/bash
# Homebridge Install Script for Servix

set -e

echo "🟢 Installing Homebridge & dependencies..."
# Homebridge is best installed via npm inside Ubuntu
npm install -g --unsafe-perm homebridge homebridge-config-ui-x

echo "✅ Homebridge installed globally in the Ubuntu environment."
