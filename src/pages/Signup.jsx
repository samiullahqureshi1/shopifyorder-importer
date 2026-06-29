import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('https://order-importer-backend.vercel.app/api/auth/signup', { name, email, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                        <UserPlus size={32} color="var(--accent-color)" />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: '#94a3b8' }}>Get started with bulk Shopify imports</p>
                </div>
                
                {error && <div style={{ color: 'var(--error)', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={16} /> {error}
                </div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <div className="input-icon"><User size={18} /></div>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="input-wrapper">
                        <div className="input-icon"><Mail size={18} /></div>
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="input-wrapper" style={{ marginBottom: '2rem' }}>
                        <div className="input-icon"><Lock size={18} /></div>
                        <input 
                            type="password" 
                            placeholder="Create password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            minLength="6"
                        />
                    </div>
                    
                    <button type="submit" style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                
                <p style={{ textAlign: 'center', marginTop: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '500' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
