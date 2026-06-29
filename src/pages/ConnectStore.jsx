import React, { useState } from 'react';
import axios from 'axios';
import { Store, Key, ArrowRight } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

function ConnectStore({ onConnect }) {
  const [storeName, setStoreName] = useState('');
  const [domain, setDomain] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/stores/connect`, { storeName, domain, accessToken: token });
      if (res.data.success) {
        onConnect(res.data.store_id);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Connect New Store</h2>
        <p style={{ color: '#94a3b8' }}>Securely connect your store via Admin GraphQL API</p>
      </div>

      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
            <Store size={18} /> Store Name (Optional)
          </label>
          <input
            type="text"
            placeholder="My Awesome Store"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
            <Store size={18} /> Store Domain
          </label>
          <input
            type="text"
            placeholder="mystore.myshopify.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
            <Key size={18} /> Admin API Access Token
          </label>
          <input
            type="password"
            placeholder="shpat_xxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <small style={{ color: '#64748b' }}>Needs scopes: write_orders, read_orders, write_products, read_products</small>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Connecting...' : 'Connect Store'} <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}

export default ConnectStore;
