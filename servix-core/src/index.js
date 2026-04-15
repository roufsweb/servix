const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const { exec, spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { setupTerminal } = require('./terminal');
const pkg = require('../package.json');

// Register CORS
fastify.register(cors, {
  origin: '*', // For development, tighten this in production
});

// Serve Static UI
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../../servix-ui/dist'),
  prefix: '/',
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

fastify.post('/api/apps/:id/action/:actionId', async (request, reply) => {
  const { id, actionId } = request.params;
  const { isInternal } = request.query;
  
  const baseDir = isInternal === 'true' ? CORE_APPS_DIR : APPS_DIR;
  const appPath = path.join(baseDir, id);
  const manifestPath = path.join(appPath, 'manifest.json');

  try {
    const manifest = await fs.readJson(manifestPath);
    const action = manifest.actions?.find(a => a.id === actionId);
    
    if (!action) return reply.status(404).send({ error: 'Action not found' });

    const scriptPath = path.join(appPath, action.script);
    
    // Execute script and return output
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      exec(`bash ${scriptPath}`, { cwd: appPath }, (error, stdout, stderr) => {
        if (error) {
          fastify.log.error(error);
          resolve({ success: false, output: stderr || error.message });
        } else {
          resolve({ success: true, output: stdout });
        }
      });
    });
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: 'Failed to execute action' });
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

// --- System API ---
fastify.get('/api/system/status', async (request, reply) => {
  return {
    version: pkg.version,
    platform: 'linux-termux',
    environment: 'proot-ubuntu'
  };
});

fastify.post('/api/system/update', async (request, reply) => {
  fastify.log.info('System update requested...');
  
  // Detached update process
  const updateScript = `
    echo "Starting update..."
    sleep 2
    git pull origin main
    npm install
    pm2 restart all
  `;

  const scriptPath = path.join(__dirname, 'update.sh');
  await fs.writeFile(scriptPath, updateScript);
  await fs.chmod(scriptPath, '755');

  spawn('sh', [scriptPath], {
    detached: true,
    stdio: 'ignore',
    cwd: path.join(__dirname, '..', '..') // Root of the project
  }).unref();

  return { success: true, message: 'Update script triggered. System will restart in 2 seconds.' };
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
