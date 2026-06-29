import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, RefreshCcw } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

function ImportResults() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const importId = location.state?.importId;

  useEffect(() => {
    if (!importId) {
        navigate('/dashboard');
        return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get(`${API_BASE}/imports/${importId}/results`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, [importId, navigate]);

  if (!data) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading results...</div>;

  const { job, orders } = data;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Import Results</h1>
          <p style={{ color: '#94a3b8' }}>Summary for {job.filename}</p>
        </div>
        <button onClick={() => navigate('/upload')} style={{ background: '#475569' }}>
          <Home size={18} /> New Import
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <div className="value">{job.total_orders}</div>
        </div>
        <div className="stat-card">
          <h3>Created</h3>
          <div className="value" style={{ color: 'var(--success)' }}>{job.created_count}</div>
        </div>
        <div className="stat-card">
          <h3>Custom Items</h3>
          <div className="value" style={{ color: '#8b5cf6' }}>{job.custom_item_count}</div>
        </div>
        <div className="stat-card">
          <h3>Failed</h3>
          <div className="value" style={{ color: 'var(--error)' }}>{job.failed_count}</div>
        </div>
      </div>

      {orders.length > 0 && (
        <>
          <h2 style={{ marginTop: '3rem' }}>Exceptions & Failures</h2>
          <div className="table-container glass-card" style={{ padding: '0' }}>
            <table>
              <thead>
                <tr>
                  <th>Old Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Message / Error</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.old_order_id}</td>
                    <td>{o.customer_email || '-'}</td>
                    <td>
                      <span className={`status-badge status-${o.status.split('_')[0]}`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ color: o.status === 'failed' ? 'var(--error)' : 'inherit', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {o.error_message || 'N/A'}
                    </td>
                    <td>
                      {o.status === 'failed' && (
                        <button style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                          <RefreshCcw size={14} /> Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ImportResults;
