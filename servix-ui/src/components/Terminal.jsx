import { useEffect, useRef } from 'preact/hooks';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export const WebTerminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#0a0a0a',
      },
      fontFamily: '"Cascadia Code", Menlo, monospace',
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;

    // WebSocket Connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.hostname}:3000/terminal`);

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    term.onData((data) => {
      ws.send(data);
    });

    window.addEventListener('resize', () => fitAddon.fit());

    return () => {
      ws.close();
      term.dispose();
    };
  }, []);

  return (
    <div style={{ height: 'calc(100% - 60px)', padding: '20px' }}>
      <div ref={terminalRef} style={{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden' }} />
    </div>
  );
};
