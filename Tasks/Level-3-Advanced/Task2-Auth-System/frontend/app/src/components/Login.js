import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email, password });

      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);

      // Store token
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('Token stored successfully');

        // Store user info if needed
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        // Redirect to dashboard
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setError('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p
          onClick={() => navigate('/register')}
          style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#007bff' }}
        >
          No account? Register
        </p>
      </form>
    </div>
  );
}
