import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function LoginPage({ onLogin }) {
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
    // TODO: Implement Google OAuth Flow
    setMessage('Google Login Coming Soon!');
  };

  return (
    <div className="login-container">
      <h1>⛏️ KRITICAL</h1>
      <p className="subtitle">Casa 13hs - Mining Platform</p>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña segura"
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>

      <button className="btn btn-google" onClick={handleGoogleLogin}>
        🔐 Continuar con Google
      </button>

      <div className="toggle-text">
        {isLogin ? 'Sin cuenta? ' : 'Ya tienes cuenta? '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Regístrate' : 'Inicia Sesión'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;