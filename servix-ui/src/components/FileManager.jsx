import { useState, useEffect } from 'preact/hooks';
import axios from 'axios';
import { File as FileIcon, Folder as FolderIcon, ArrowLeft } from 'lucide-preact';

const API_URL = 'http://localhost:3000/api';

export const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFiles = async (path) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/files/ls?path=${encodeURIComponent(path)}`);
      setFiles(res.data);
      setCurrentPath(path);
    } catch (err) {
      console.error('Failed to fetch files', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles('');
  }, []);

  const goBack = () => {
    const parent = currentPath.split('/').slice(0, -1).join('/');
    fetchFiles(parent);
  };

  return (
    <div style={{ padding: '20px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={goBack} disabled={!currentPath} className="btn" style={{ padding: '6px' }}><ArrowLeft size={16} /></button>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{currentPath || '/root'}</span>
      </div>
      
      <div className="glass" style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Size</th>
                <th style={{ padding: '12px' }}>Modified</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr 
                  key={file.path} 
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                  onClick={() => file.isDirectory && fetchFiles(file.path)}
                  className="file-row"
                >
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {file.isDirectory ? <FolderIcon size={16} color="var(--accent)" /> : <FileIcon size={16} />}
                    {file.name}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {file.isDirectory ? '-' : `${(file.size / 1024).toFixed(1)} KB`}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {new Date(file.mtime).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
