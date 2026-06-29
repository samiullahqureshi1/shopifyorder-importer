import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Store, Plus, Trash2, CheckCircle } from 'lucide-react';
import ConnectStore from './ConnectStore';

function Dashboard() {
    const { user, activeStoreId, changeActiveStore } = useContext(AuthContext);
    const [stores, setStores] = useState([]);
    const [showConnect, setShowConnect] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStores = async () => {
        try {
            const res = await axios.get('https://order-importer-backend.vercel.app/api/stores');
            setStores(res.data);
            
            // Auto-select first store if none is active
            if (res.data.length > 0 && !activeStoreId) {
                changeActiveStore(res.data[0].id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this store?')) return;
        try {
            await axios.delete(`https://order-importer-backend.vercel.app/api/stores/${id}`);
            if (activeStoreId == id) changeActiveStore(null);
            fetchStores();
        } catch (e) {
            alert('Failed to delete store');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading dashboard...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Welcome, {user.name}</h1>
                    <p style={{ color: '#94a3b8' }}>Manage your Shopify stores and bulk imports</p>
                </div>
                <button onClick={() => setShowConnect(!showConnect)}>
                    <Plus size={18} /> Connect New Store
                </button>
            </div>

            {showConnect && (
                <div style={{ marginBottom: '2rem' }}>
                    <ConnectStore onConnect={() => { setShowConnect(false); fetchStores(); }} />
                </div>
            )}

            <h2>Connected Stores</h2>
            {stores.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Store size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: '#94a3b8' }}>You haven't connected any stores yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {stores.map(store => (
                        <div key={store.id} className="glass-card" style={{ 
                            border: activeStoreId == store.id ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
                            position: 'relative'
                        }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Store size={20} color="var(--accent-color)" /> {store.store_name}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{store.store_domain}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {activeStoreId == store.id ? (
                                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                                        <CheckCircle size={16} /> Active Store
                                    </span>
                                ) : (
                                    <button onClick={() => changeActiveStore(store.id)} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--glass-border)' }}>
                                        Select
                                    </button>
                                )}
                                <button onClick={() => handleDelete(store.id)} style={{ padding: '0.4rem', background: 'transparent', color: 'var(--error)' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
