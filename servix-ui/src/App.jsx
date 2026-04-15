import { useState } from 'preact/hooks';
import { Route, Switch, Link, useLocation } from 'wouter';
import { LayoutGrid, Folder, Terminal as TerminalIcon, Settings, HardDrive, Cpu } from 'lucide-preact';
import { WebTerminal } from './components/Terminal';
import { FileManager } from './components/FileManager';

// Components
const Sidebar = () => {
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <Cpu size={14} /> 12% | <HardDrive size={14} /> 45%
        </div>
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
  const [apps] = useState([
    { name: 'Jellyfin', icon: '💿', status: 'Running', port: 8096 },
    { name: 'Homebridge', icon: '🏠', status: 'Stopped', port: 8581 },
    { name: 'Cloudflared', icon: '☁️', status: 'Running' },
    { name: 'QuickShare', icon: '📁', status: 'Stopped', port: 8080 },
  ]);

  return (
    <div className="app-grid">
      {apps.map(app => (
        <div key={app.name} className="app-card glass">
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>{app.icon}</div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{app.name}</div>
          <div style={{ fontSize: '12px', color: app.status === 'Running' ? '#10b981' : 'var(--text-muted)', marginBottom: '16px' }}>
             ● {app.status}
          </div>
          <button className="btn" style={{ width: '100%', background: app.status === 'Running' ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent)', color: app.status === 'Running' ? '#ef4444' : 'white' }}>
            {app.status === 'Running' ? 'Stop' : 'Start'}
          </button>
        </div>
      ))}
      <div className="app-card glass" style={{ borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>+ Add App</div>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar />
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
