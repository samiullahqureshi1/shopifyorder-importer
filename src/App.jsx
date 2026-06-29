import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UploadOrders from './pages/UploadOrders';
import ImportPreview from './pages/ImportPreview';
import ImportProgress from './pages/ImportProgress';
import ImportResults from './pages/ImportResults';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            
            <Route path="/upload" element={
              <PrivateRoute><UploadOrders /></PrivateRoute>
            } />

            <Route path="/preview" element={
              <PrivateRoute><ImportPreview /></PrivateRoute>
            } />

            <Route path="/progress" element={
              <PrivateRoute><ImportProgress /></PrivateRoute>
            } />

            <Route path="/results" element={
              <PrivateRoute><ImportResults /></PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
