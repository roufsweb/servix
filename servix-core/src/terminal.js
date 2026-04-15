const pty = require('node-pty');
const WebSocket = require('ws');

function setupTerminal(server) {
  const wss = new WebSocket.Server({ noServer: true });

  server.server.on('upgrade', (request, socket, head) => {
    if (request.url === '/terminal') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws) => {
    console.log('Terminal: Client connected');

    const shell = process.env.SHELL || 'bash';
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env
    });

    ptyProcess.on('data', (data) => {
      ws.send(data);
    });

    ws.on('message', (message) => {
      ptyProcess.write(message.toString());
    });

    ws.on('close', () => {
      ptyProcess.kill();
      console.log('Terminal: Client disconnected');
    });
  });
}

module.exports = setupTerminal;
