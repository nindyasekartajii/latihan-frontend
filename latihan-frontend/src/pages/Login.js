import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setMessage('Login berhasil!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} className="form-control mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="form-control mb-2" />
        <button type="submit" className="btn btn-success">Login</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default Login;