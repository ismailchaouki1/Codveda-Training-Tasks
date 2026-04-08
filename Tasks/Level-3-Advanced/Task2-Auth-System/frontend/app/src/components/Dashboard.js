import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log('Dashboard - Token exists:', !!token);

      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching user data...');
        const res = await api.get('/auth/me');
        console.log('User data received:', res.data);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>{error}</h2>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      <h1>Welcome, {user?.name}!</h1>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>User ID:</strong> {user?._id}
      </p>
      <button
        onClick={logout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
}
