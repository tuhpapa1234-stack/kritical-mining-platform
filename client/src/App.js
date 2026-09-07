import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verify token on mount
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      {token ? (
        <DashboardPage token={token} user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={(token, user) => {
          setToken(token);
          setUser(user);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }} />
      )}
    </div>
  );
}

export default App;