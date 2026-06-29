import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, FileType, AlertCircle, Store } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

function UploadOrders() {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${API_BASE}/stores`);
        setStores(res.data);
      } catch (err) {
        console.error('Failed to load stores');
      }
    };
    fetchStores();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (f) => {
    setError('');
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) {
      setFile(f);
    } else {
      setError('Please upload a valid CSV or XLSX file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedStoreId) {
        setError('Please select a store before uploading orders.');
        return;
    }
    if (!file) {
        setError('Please select a file.');
        return;
    }
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('store_id', selectedStoreId);

    try {
      const res = await axios.post(`${API_BASE}/imports/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/preview', { state: { parsedData: res.data, storeId: selectedStoreId } });
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
      <h1>Upload Orders</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Upload your CSV or Excel file containing legacy orders.</p>

      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><AlertCircle size={18} /> {error}</div>}

      <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>
          <Store size={18} /> Select Store
        </label>
        <select 
          value={selectedStoreId} 
          onChange={(e) => { setSelectedStoreId(e.target.value); setError(''); }}
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
        >
          <option value="" disabled>Select a store</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.store_name}</option>
          ))}
        </select>
      </div>

      <div 
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: '2px dashed var(--glass-border)',
          borderRadius: '12px',
          padding: '3rem 2rem',
          cursor: 'pointer',
          background: 'rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          marginBottom: '2rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
      >
        <input 
          type="file" 
          accept=".csv,.xlsx,.xls" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleChange}
        />
        {file ? (
          <div>
            <FileType size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ margin: 0 }}>{file.name}</h3>
            <p style={{ color: '#64748b' }}>{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <div>
            <UploadCloud size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <p>Click or drag and drop your file here</p>
            <small style={{ color: '#64748b' }}>Supports .csv, .xlsx</small>
          </div>
        )}
      </div>

      <button onClick={handleUpload} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
        {loading ? 'Processing...' : 'Continue to Preview'}
      </button>
    </div>
  );
}

export default UploadOrders;
