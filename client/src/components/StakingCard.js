import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function StakingCard({ token, userData, onRefresh }) {
  const [staking, setStaking] = useState(userData?.staking || {});
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleStake = async () => {
    if (!stakeAmount || stakeAmount <= 0) {
      setMessage('Ingresa una cantidad válida');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/staking/stake`, 
        { amount: parseFloat(stakeAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStaking(prev => ({
        ...prev,
        stakedAmount: response.data.stakedAmount
      }));
      setMessage('✅ Staking exitoso');
      setStakeAmount('');
      onRefresh();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error en staking');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/staking/claim-rewards`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaking(prev => ({
        ...prev,
        stakingRewards: response.data.rewards
      }));
      setMessage(`✅ Recompensas reclamadas: ${response.data.rewards}`);
      onRefresh();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error reclamando recompensas');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/staking/unstake`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaking(prev => ({
        ...prev,
        stakedAmount: 0
      }));
      setMessage('✅ Retiro de staking exitoso');
      onRefresh();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error retirando staking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📈 Staking (12% APY)</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <div className="mining-stats">
        <div className="stat-item">
          <span className="stat-label">Stakeado:</span>
          <span className="stat-value">{(staking.stakedAmount || 0).toLocaleString()} KRT</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Recompensas:</span>
          <span className="stat-value">{(staking.stakingRewards || 0).toLocaleString()} KRT</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">APY:</span>
          <span className="stat-value">12% anual</span>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>Hacer Staking</h3>
        <div className="staking-input">
          <input
            type="number"
            placeholder="Cantidad a stakear"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
          />
          <button className="btn-secondary" onClick={handleStake} disabled={loading}>
            Stakear
          </button>
        </div>
      </div>

      {staking.stakedAmount > 0 && (
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={handleClaimRewards} disabled={loading} style={{ flex: 1 }}>
            💰 Reclamar
          </button>
          <button className="btn-secondary" onClick={handleUnstake} disabled={loading} style={{ flex: 1 }}>
            🔓 Deshacer
          </button>
        </div>
      )}
    </div>
  );
}

export default StakingCard;