import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function LoginPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const data = isLogin 
        ? { email, password }
        : { email, username, password };

      const response = await axios.post(`${API}${endpoint}`, data);
      
      onLogin(response.data.token, response.data.user);
      setMessage('¡Bienvenido a Kritical!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('🔐 Integrando con Google...');
    // TODO: Implement Google OAuth Flow
    setTimeout(() => {
      setMessage('Google Login Coming Soon!');
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>⛏️ KRITICAL</h1>
        <p className="subtitle">Entra a tu Cuenta</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') || message.includes('Coming') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>👤 Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
            />
          </div>
        )}

        <div className="form-group">
          <label>📧 Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label>🔐 Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña segura"
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? '⏳ Cargando...' : isLogin ? '🔓 Iniciar Sesión' : '✏️ Registrarse'}
        </button>
      </form>

      <button className="btn btn-google" onClick={handleGoogleLogin}>
        🔐 Continuar con Google
      </button>

      <div className="toggle-text">
        {isLogin ? '¿Sin cuenta? ' : '¿Ya tienes cuenta? '}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Regístrate' : 'Inicia Sesión'}
        </button>
      </div>

      <button className="btn btn-back" onClick={onBack}>
        ← Volver Atrás
      </button>
    </div>
  );
}

export default LoginPage;