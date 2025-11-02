import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root ke halaman login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Halaman login dan register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard hanya bisa diakses jika sudah login */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback untuk route yang tidak dikenal */}
        <Route path="*" element={<h3 className="text-center mt-5">404 - Halaman tidak ditemukan</h3>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;