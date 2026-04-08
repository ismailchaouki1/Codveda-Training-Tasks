import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
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
      console.log('Attempting registration with:', { name, email, password });

      const res = await api.post('/auth/register', { name, email, password });
      console.log('Registration response:', res.data);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('Token stored successfully');

        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        setError('No token received from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || 'Registration failed');
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
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

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
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p
          onClick={() => navigate('/login')}
          style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#007bff' }}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
