#!/bin/bash
# Tailscale Startup (Userspace Mode)
./tailscaled --tun=userspace-networking --socket=/root/tailscaled.sock
