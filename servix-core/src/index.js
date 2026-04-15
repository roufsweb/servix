const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs-extra');
const cors = require('fastify-cors');
const setupTerminal = require('./terminal');

// Register CORS
fastify.register(cors, {
  origin: '*', // For development, tighten this in production
});

// Setup Terminal WebSocket
setupTerminal(fastify);

// App Settings
const APP_PORT = process.env.PORT || 3000;
const APPS_DIR = path.join(__dirname, '../../servix-apps/external');
const CORE_APPS_DIR = path.join(__dirname, '../../servix-apps/internal');

// --- Service Management API ---

fastify.get('/api/apps', async (request, reply) => {
  try {
    const apps = [];
    const dirs = [CORE_APPS_DIR, APPS_DIR];
    
    for (const dir of dirs) {
      if (await fs.pathExists(dir)) {
        const folders = await fs.readdir(dir);
        for (const folder of folders) {
          const manifestPath = path.join(dir, folder, 'manifest.json');
          if (await fs.pathExists(manifestPath)) {
            const manifest = await fs.readJson(manifestPath);
            apps.push({ ...manifest, status: 'stopped' }); // Placeholder status
          }
        }
      }
    }
    return apps;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Failed to list apps' });
  }
});

// --- File Explorer API ---

fastify.get('/api/files/ls', async (request, reply) => {
  const { path: queryPath } = request.query;
  const targetPath = queryPath || process.env.HOME || '/root';
  
  try {
    const files = await fs.readdir(targetPath);
    const result = [];
    for (const file of files) {
      const fullPath = path.join(targetPath, file);
      const stats = await fs.stat(fullPath);
      result.push({
        name: file,
        path: fullPath,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        mtime: stats.mtime
      });
    }
    return result;
  } catch (err) {
    return reply.status(500).send({ error: 'Failed to list directory' });
  }
});

fastify.get('/api/files/read', async (request, reply) => {
  const { path: filePath } = request.query;
  if (!filePath) return reply.status(400).send({ error: 'Path required' });

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return { content };
  } catch (err) {
    return reply.status(500).send({ error: 'Failed to read file' });
  }
});

// --- System Info API ---
fastify.get('/api/sysinfo', async (request, reply) => {
  const os = require('os');
  return {
    uptime: os.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
    cpu: os.cpus()[0].model,
    load: os.loadavg(),
  };
});

// Start Server
const start = async () => {
  try {
    await fastify.listen({ port: APP_PORT, host: '0.0.0.0' });
    fastify.log.info(`Servix Core running at http://localhost:${APP_PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
