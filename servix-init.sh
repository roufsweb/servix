#!/bin/bash

# Servix Environment Bootstrapper (Ubuntu Edition)
# Designed for Android Termux

set -e

echo "🚀 Bootstrapping Servix Environment..."

# 1. Update Termux Packages
echo "📦 Updating Termux..."
pkg update && pkg upgrade -y

# 2. Install proot-distro
echo "🏗️ Installing proot-distro..."
pkg install proot-distro -y

# 3. Install Ubuntu
echo "🐧 Installing Ubuntu (Jammy)..."
if proot-distro list | grep -q "ubuntu"; then
    echo "Ubuntu already installed."
else
    proot-distro install ubuntu
fi

# 4. Prepare Setup Script for inside Ubuntu
cat << 'EOF' > setup_inside.sh
#!/bin/bash
apt update && apt upgrade -y
apt install -y curl wget unzip build-essential python3

# Install Node.js (LTS)
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Cleanup Ubuntu overhead (Remove snapd/systemd stubs if they exist)
apt remove --purge -y snapd || true

# Setup directory
mkdir -p /root/servix
echo "✅ Ubuntu Environment Ready."
EOF

# 5. Run Setup Script inside Ubuntu
echo "🛠️ Configuring Ubuntu Environment..."
proot-distro login ubuntu -- bash -c "$(cat setup_inside.sh)"

rm setup_inside.sh

echo "✨ Servix Environment Setup Complete!"
echo "To enter Servix environment, run: proot-distro login ubuntu"
