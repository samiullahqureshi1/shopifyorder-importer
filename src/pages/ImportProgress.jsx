import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

function ImportProgress() {
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const importId = location.state?.importId;

  useEffect(() => {
    if (!importId) {
        navigate('/dashboard');
        return;
    }

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${API_BASE}/imports/${importId}/progress`);
        setJob(res.data);

        if (res.data.status === 'completed' || res.data.status === 'failed') {
          // Stop polling, wait a moment then go to results
          setTimeout(() => {
            navigate('/results', { state: { importId } });
          }, 2000);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 1000);
    return () => clearInterval(interval);
  }, [importId, navigate]);

  if (!job) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading progress...</div>;
  }

  const processed = job.created_count + job.custom_item_count + job.failed_count + job.duplicate_count;
  const progressPercent = job.total_orders > 0 ? (processed / job.total_orders) * 100 : 0;

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '4rem auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Importing Orders</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
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
          <h3>Duplicates</h3>
          <div className="value" style={{ color: 'var(--warning)' }}>{job.duplicate_count}</div>
        </div>
        <div className="stat-card">
          <h3>Failed</h3>
          <div className="value" style={{ color: 'var(--error)' }}>{job.failed_count}</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>{job.status === 'completed' ? 'Completed' : 'Processing...'}</span>
          <span>{processed} / {job.total_orders} ({Math.round(progressPercent)}%)</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {job.status === 'completed' && (
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <CheckCircle size={24} /> Import process finished! Redirecting to results...
        </div>
      )}
    </div>
  );
}

export default ImportProgress;
