import { useEffect, useState } from 'preact/hooks';
import { Route, Switch, Link, useLocation } from 'wouter';
import { LayoutGrid, Folder, Terminal as TerminalIcon, Cpu, RefreshCw, CheckCircle } from 'lucide-preact';
import { WebTerminal } from './components/Terminal';
import { FileManager } from './components/FileManager';

// Components
const Sidebar = ({ version, onUpdate }) => {
  const [location] = useLocation();
  
  return (
    <div className="sidebar glass">
      <div style={{ padding: '24px', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid var(--border)' }}>
        Servix
      </div>
      <div style={{ marginTop: '20px', flex: 1 }}>
        <NavItem href="/" icon={<LayoutGrid size={20} />} label="Apps" active={location === '/'} />
        <NavItem href="/files" icon={<Folder size={20} />} label="Files" active={location === '/files'} />
        <NavItem href="/terminal" icon={<TerminalIcon size={20} />} label="Terminal" active={location === '/terminal'} />
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Server v{version || '1.0.0'}
        </div>
        <button 
          onClick={onUpdate}
          className="btn" 
          style={{ width: '100%', fontSize: '12px', display: 'flex', gap: '8px', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}
        >
          <RefreshCw size={14} /> Update System
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ href, icon, label, active }) => (
  <Link href={href}>
    <div className={`nav-item ${active ? 'active' : ''}`}>
      {icon}
      <span>{label}</span>
    </div>
  </Link>
);

// Pages
const Dashboard = () => {
  const [apps, setApps] = useState([]);
  const [actionResult, setActionResult] = useState(null);

  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(data => setApps(data))
      .catch(err => console.error('Failed to fetch apps', err));
  }, []);

  const runAction = async (appId, actionId) => {
    setActionResult({ title: 'Running Action...', output: 'Please wait...' });
    try {
      const res = await fetch(`/api/apps/${appId}/action/${actionId}`, { method: 'POST' });
      const data = await res.json();
      setActionResult({ title: 'Action Result', output: data.output });
    } catch (err) {
      setActionResult({ title: 'Error', output: err.message });
    }
  };

  return (
    <div className="app-grid">
      {actionResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass" style={{ maxWidth: '600px', width: '100%', padding: '32px', borderRadius: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>{actionResult.title}</h3>
            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', overflowX: 'auto', fontSize: '13px', whiteSpace: 'pre-wrap', maxHeight: '300px' }}>
              {actionResult.output}
            </pre>
            <button className="btn" style={{ marginTop: '24px', width: '100%' }} onClick={() => setActionResult(null)}>Close</button>
          </div>
        </div>
      )}
      {apps.map(app => (
        <div key={app.id} className="app-card glass">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>{app.icon}</div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{app.name}</div>
          <div style={{ fontSize: '12px', color: app.status === 'running' ? '#10b981' : 'var(--text-muted)', marginBottom: '16px' }}>
             ● {app.status}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn" style={{ width: '100%', background: app.status === 'running' ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent)', color: app.status === 'running' ? '#ef4444' : 'white' }}>
              {app.status === 'running' ? 'Stop' : 'Start'}
            </button>
            {app.actions && app.actions.map(action => (
              <button 
                key={action.id}
                className="btn" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontSize: '12px' }}
                onClick={() => runAction(app.id, action.id)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="app-card glass" style={{ borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>+ Add App</div>
      </div>
    </div>
  );
};

const UpdatingOverlay = () => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div className="glass" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px', border: '1px solid var(--accent)' }}>
      <RefreshCw size={48} className="spin" style={{ color: 'var(--accent)', marginBottom: '24px' }} />
      <h2 style={{ marginBottom: '8px' }}>Updating Servix</h2>
      <p style={{ color: 'var(--text-muted)' }}>Pulling latest changes and restarting services...</p>
    </div>
  </div>
);

export const App = () => {
  const [system, setSystem] = useState({ version: '1.0.0' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => setSystem(data))
      .catch(err => console.error('Failed to fetch system status', err));
  }, []);

  const handleUpdate = async () => {
    if (!confirm('Update Servix to the latest version? The system will restart.')) return;
    
    setIsUpdating(true);
    try {
      await fetch('/api/system/update', { method: 'POST' });
      // The overlay stays until the page reloads (triggered by user or timeout)
      setTimeout(() => {
        window.location.reload();
      }, 10000); // 10 seconds for restart
    } catch (err) {
      alert('Update failed: ' + err.message);
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {isUpdating && <UpdatingOverlay />}
      <Sidebar version={system.version} onUpdate={handleUpdate} />
      <div className="main-content">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/files" component={FileManager} />
          <Route path="/terminal" component={WebTerminal} />
        </Switch>
      </div>
    </div>
  );
};
