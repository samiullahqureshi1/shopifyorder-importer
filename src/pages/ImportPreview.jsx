import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Play } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

function ImportPreview({ onStart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const parsedData = location.state?.parsedData;
  const storeId = location.state?.storeId;

  if (!parsedData || !storeId) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>No data to preview or store not selected</h2>
        <button onClick={() => navigate('/upload')}>Go Back</button>
      </div>
    );
  }

  const { filename, parsedOrders } = parsedData;

  const handleStartImport = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/imports/start`, {
        store_id: storeId,
        filename: filename,
        orders: parsedOrders
      });
      
      if (res.data.success) {
        navigate('/progress', { state: { importId: res.data.import_id } });
      }
    } catch (err) {
      alert('Failed to start import: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Import Preview</h1>
          <p style={{ color: '#94a3b8' }}>Found {parsedOrders.length} valid orders in <strong>{filename}</strong>.</p>
        </div>
        <button onClick={handleStartImport} disabled={loading} style={{ background: 'var(--success)' }}>
          {loading ? 'Starting...' : 'Start Import'} <Play size={18} />
        </button>
      </div>

      <div className="table-container glass-card" style={{ padding: '0' }}>
        <table>
          <thead>
            <tr>
              <th>Row</th>
              <th>Old Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>SKU / Handle</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Shipping</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {parsedOrders.slice(0, 100).map((order, i) => (
              <tr key={i}>
                <td>{order.row_index}</td>
                <td>{order.old_order_id}</td>
                <td>{order.customer_name || '-'}</td>
                <td>{order.email || '-'}</td>
                <td>
                  {order.sku || '-'} 
                  <br />
                  <small style={{ color: '#64748b' }}>{order.handle || ''}</small>
                </td>
                <td>{order.quantity}</td>
                <td>${order.price}</td>
                <td>${order.shipping_price}</td>
                <td>
                  <span className="status-badge status-pending">Pending Check</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {parsedOrders.length > 100 && (
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b' }}>Showing first 100 orders...</p>
      )}
    </div>
  );
}

export default ImportPreview;
