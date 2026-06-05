import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#151820',
              color: '#e8eaf6',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: '10px',
              fontFamily: 'Sora, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#151820' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#151820' } },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks"     element={<Tasks />} />
            <Route path="/profile"   element={<Profile />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
