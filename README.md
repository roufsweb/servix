# Servix 🚀

A lightweight, user-space application platform designed for **Android Termux** and **proot** environments. Inspired by CasaOS and Umbrel, built for low-power performance.

![Aesthetic Dashboard Preview](https://via.placeholder.com/800x400?text=Servix+Dashboard+Glassmorphism)

## ✨ Features
- **Ultra-Low Resource**: Background overhead < 100MB RAM.
- **Ubuntu proot**: High compatibility with homelab apps (Jellyfin, Homebridge, etc.).
- **Interactive Terminal**: Built-in web-based terminal for direct command access.
- **File Manager**: Navigate and manage your files through a premium UI.
- **Modular Apps**: Easy to add/remove apps via simple shell scripts.

## 📦 Installation (Termux)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/servix.git
   cd servix
   ```

2. **Run the Bootstrapper:**
   ```bash
   chmod +x servix-init.sh
   ./servix-init.sh
   ```
   *This will setup Ubuntu, Node.js, and all necessary dependencies.*

3. **Start Servix:**
   ```bash
   # Start the Backend
   cd servix-core && npm install && npm start
   
   # Start the Frontend (In another session)
   cd servix-ui && npm install && npm run dev
   ```

## 🛠️ Usage
- **Dashboard**: Access via `http://localhost:3001` (or your device IP).
- **Core API**: Runs on `http://localhost:3000`.
- **Apps**: Install apps via the "Add App" button in the UI or by adding files to `servix-apps/external`.

## 🗑️ Uninstallation
To completely remove Servix and the Ubuntu environment:
```bash
chmod +x uninstall.sh
./uninstall.sh
```

## 📂 Project Structure
- `servix-core/`: Fastify-based backend.
- `servix-ui/`: Preact-based dashboard.
- `servix-apps/`: App registry and shell scripts.
- `servix-init.sh`: The environment setup script.

## 🤝 Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) (coming soon).

---
Built with ❤️ for the Android Community.
