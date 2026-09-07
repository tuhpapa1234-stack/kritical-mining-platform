import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function MiningCard({ token, userData, onRefresh }) {
  const [mining, setMining] = useState(userData?.mining || {});
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(false);
  const [minedBlocks, setMinedBlocks] = useState(() => {
    const saved = localStorage.getItem('minedBlocks');
    return saved ? JSON.parse(saved) : [];
  });
  const [message, setMessage] = useState('');

  // Actualizar contador cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      if (mining.nextMiningTime) {
        const now = new Date();
        const next = new Date(mining.nextMiningTime);
        const diff = next - now;

        if (diff > 0) {
          const hours = Math.floor(diff / 3600000);
          const minutes = Math.floor((diff % 3600000) / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeLeft('¡Listo para reclamar!');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mining.nextMiningTime]);

  const handleStartMining = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/mining/start`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMining(prev => ({
        ...prev,
        miningActive: true,
        nextMiningTime: response.data.nextMiningTime
      }));
      setMessage('⛏️ ¡Minería iniciada!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error iniciando minería');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/mining/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Agregar bloque minado
      const newBlock = {
        id: Date.now(),
        amount: response.data.reward,
        date: new Date().toLocaleString(),
        timestamp: new Date().toISOString()
      };
      
      const updatedBlocks = [newBlock, ...minedBlocks];
      setMinedBlocks(updatedBlocks);
      localStorage.setItem('minedBlocks', JSON.stringify(updatedBlocks));
      
      setMining(prev => ({
        ...prev,
        currentSession: response.data.reward,
        nextMiningTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
        miningActive: false
      }));
      
      setMessage(`🎉 ¡${response.data.reward} KRT reclamados! + ${response.data.referralBonus} referencia`);
      setTimeout(() => setMessage(''), 3000);
      onRefresh();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error reclamando recompensas');
    } finally {
      setLoading(false);
    }
  };

  const canClaim = timeLeft === '¡Listo para reclamar!';
  const canMine = !mining.miningActive;

  return (
    <div className="card">
      <h2>⛏️ Minería</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
      
      <div className="mining-container">
        <div className="coin-logo">
          <div className="coin-circle">$KRT</div>
        </div>

        <div className="mining-info">
          <div className="mining-stats">
            <div className="stat-item">
              <span className="stat-label">Total Minado:</span>
              <span className="stat-value">{(mining.totalMined || 0).toLocaleString()} KRT</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sesión Actual:</span>
              <span className="stat-value">{(mining.currentSession || 0).toLocaleString()} KRT</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estado:</span>
              <span className="stat-value">{mining.miningActive ? '🔄 Minando' : '⏸️ Inactivo'}</span>
            </div>
          </div>

          <div className="mining-timer">
            <div className="timer-label">Próxima reclamación:</div>
            <div className="timer-display">{timeLeft || '00:00:00'}</div>
          </div>

          <button
            className="btn-mine"
            onClick={handleStartMining}
            disabled={!canMine || loading}
          >
            {mining.miningActive ? '⏳ Minando...' : '▶️ Iniciar Minería'}
          </button>

          {canClaim && (
            <button
              className="btn-mine"
              onClick={handleClaimRewards}
              disabled={loading}
              style={{ marginTop: '10px' }}
            >
              {loading ? '⏳ Procesando...' : '💰 Reclamar Recompensas'}
            </button>
          )}
        </div>
      </div>

      {/* Bloques Minados */}
      <div className="mined-blocks">
        <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>📦 Bloques Minados</h3>
        {minedBlocks.length > 0 ? (
          <div className="blocks-grid">
            {minedBlocks.map((block) => (
              <div key={block.id} className="block" title={block.date}>
                <div>
                  <div className="block-label">+{block.amount}</div>
                  <div className="block-label">KRT</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Sin bloques minados aún</p>
        )}
      </div>
    </div>
  );
}

export default MiningCard;