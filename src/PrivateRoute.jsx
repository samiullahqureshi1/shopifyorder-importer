import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function PrivateRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</div>;

    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
