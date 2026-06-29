import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [activeStoreId, setActiveStoreId] = useState(localStorage.getItem('activeStoreId') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Fetch user profile
            axios.get('https://order-importer-backend.vercel.app/api/auth/me')
                .then(res => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (tokenData, userData) => {
        localStorage.setItem('token', tokenData);
        setToken(tokenData);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('activeStoreId');
        setToken(null);
        setUser(null);
        setActiveStoreId(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const changeActiveStore = (storeId) => {
        setActiveStoreId(storeId);
        localStorage.setItem('activeStoreId', storeId);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, activeStoreId, changeActiveStore }}>
            {children}
        </AuthContext.Provider>
    );
};
