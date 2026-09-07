import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ReferralCard({ token, userData, onRefresh }) {
  const [referral, setReferral] = useState(userData?.referral || {});
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleJoinReferral = async () => {
    if (!referralCode) {
      setMessage('Ingresa un código de referencia');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/api/referral/join`, { referralCode }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReferral(prev => ({
        ...prev,
        referredBy: referralCode
      }));
      setMessage('✅ Te uniste a un referido');
      setReferralCode('');
      onRefresh();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uniendo referido');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referral.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <h2>👥 Referidos (10% Bonus)</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <div className="mining-stats">
        <div className="stat-item">
          <span className="stat-label">Referidos:</span>
          <span className="stat-value">{referral.referrals?.length || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ganancias:</span>
          <span className="stat-value">{(referral.totalReferralEarnings || 0).toLocaleString()} KRT</span>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>📤 Tu Código de Referencia</h3>
        {referral.referralCode ? (
          <div className="referral-code-box">
            <div className="referral-code">{referral.referralCode}</div>
            <button className="copy-btn" onClick={handleCopyCode}>
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        ) : (
          <p style={{ color: '#999' }}>Obtendrás tu código en el siguiente ciclo de minería</p>
        )}
      </div>

      {!referral.referredBy && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>📥 Usar Código de Referencia</h3>
          <div className="staking-input">
            <input
              type="text"
              placeholder="REF_..."
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
            <button className="btn-secondary" onClick={handleJoinReferral} disabled={loading}>
              Usar
            </button>
          </div>
        </div>
      )}

      {referral.referrals && referral.referrals.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>📊 Mis Referidos</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {referral.referrals.map((ref, idx) => (
              <div key={idx} className="stat-item">
                <span className="stat-label">Usuario #{idx + 1}</span>
                <span className="stat-value">+{ref.earnings} KRT</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferralCard;