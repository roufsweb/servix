#!/bin/bash

# Servix Environment Bootstrapper (Ubuntu Edition)
# Designed for Android Termux

set -e

echo "🚀 Bootstrapping Servix Environment..."

# 1. Update Termux Packages
echo "📦 Updating Termux..."
pkg update && pkg upgrade -y
pkg install termux-api git -y

# 2. Enable Wake Lock (Keep Termux alive in background)
echo "🔋 Enabling Wake Lock..."
termux-wake-lock

# 3. Install proot-distro
echo "🏗️ Installing proot-distro..."
pkg install proot-distro -y

# 4. Install Ubuntu
echo "🐧 Installing Ubuntu (Jammy)..."
if proot-distro list | grep -q "ubuntu"; then
    echo "Ubuntu already installed."
else
    proot-distro install ubuntu
fi

# 5. Prepare Setup Script for inside Ubuntu
cat << 'EOF' > setup_inside.sh
#!/bin/bash
apt update && apt upgrade -y
apt install -y curl wget unzip build-essential python3

# Install Node.js (LTS)
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
echo "🚀 Installing PM2..."
npm install -g pm2

# Cleanup Ubuntu overhead
apt remove --purge -y snapd || true

# Setup directory
mkdir -p /root/servix
echo "✅ Ubuntu Environment Ready."
EOF

# 6. Run Setup Script inside Ubuntu
echo "🛠️ Configuring Ubuntu Environment..."
proot-distro login ubuntu -- bash -c "$(cat setup_inside.sh)"

rm setup_inside.sh

# 7. Start Services via PM2
echo "⚡ Starting Servix Services..."
proot-distro login ubuntu -- bash -c "cd /root/servix/servix-core && npm install && pm2 start src/index.js --name servix-core"
# Note: In a real termux setup, we would also install/start the UI here if needed.

echo "✨ Servix Environment Setup Complete!"
echo "Servix is now running in the background via PM2."
echo "To check logs, run: proot-distro login ubuntu -- pm2 logs"
