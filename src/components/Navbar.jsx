import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { LogOut, LayoutDashboard, UploadCloud, RefreshCw } from 'lucide-react';
import axios from 'axios';

function Navbar() {
    const { user, logout, activeStoreId, changeActiveStore } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    
    useEffect(() => {
        if (user) {
            axios.get('https://order-importer-backend.vercel.app/api/stores').then(res => {
                setStores(res.data);
            });
        }
    }, [user]);

    if (!user) return null;

    const activeStore = stores.find(s => s.id.toString() === activeStoreId?.toString());

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h3 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                    Bulk Importer
                </h3>
                
                {activeStore && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                            {activeStore.store_name}
                        </span>
                        <select 
                            value={activeStoreId || ''} 
                            onChange={(e) => changeActiveStore(e.target.value)}
                            style={{ background: 'transparent', color: '#fff', border: '1px solid var(--glass-border)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                        >
                            <option value="" disabled>Change Store</option>
                            {stores.map(s => (
                                <option key={s.id} value={s.id}>{s.store_name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>
                    <LayoutDashboard size={16} /> Dashboard
                </button>
                {activeStoreId && (
                    <button onClick={() => navigate('/upload')} style={{ padding: '0.5rem 1rem' }}>
                        <UploadCloud size={16} /> Upload
                    </button>
                )}
                <button onClick={() => { logout(); navigate('/login'); }} style={{ padding: '0.5rem 1rem', background: 'var(--error)' }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
