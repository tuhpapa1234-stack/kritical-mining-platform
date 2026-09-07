import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function WalletCard({ token, userData, onRefresh }) {
  const [wallet, setWallet] = useState(userData?.wallet || {});
  const [bnbAddress, setBnbAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showWhitepaper] = useState(false);

  const handleConnectBNB = async () => {
    if (!bnbAddress) {
      setMessage('Por favor ingresa una dirección BNB');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/wallet/connect-bnb`, { bnbAddress }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWallet(prev => ({ ...prev, bnbAddress }));
      setMessage('✅ Wallet BNB conectada exitosamente');
      setBnbAddress('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error conectando wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      setMessage('Ingresa una cantidad válida');
      return;
    }

    if (!wallet.bnbAddress) {
      setMessage('Conecta una wallet BNB primero');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/wallet/withdraw`, 
        { amount: parseFloat(withdrawAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWallet(prev => ({ ...prev, balance: response.data.newBalance }));
      setMessage(`✅ Retiro iniciado: ${response.data.txHash}`);
      setWithdrawAmount('');
      onRefresh();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error en el retiro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>💼 Wallet</h2>
      {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

      <div className="wallet-info">
        <div className="stat-item">
          <span className="stat-label">Balance:</span>
          <span className="stat-value">{(wallet.balance || 0).toLocaleString()} KRT</span>
        </div>

        <div className="wallet-balance">
          {(wallet.balance || 0).toLocaleString()} 💎
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>🔗 Conectar Wallet BNB</h3>
          <div className="staking-input">
            <input
              type="text"
              placeholder="0x..."
              value={bnbAddress}
              onChange={(e) => setBnbAddress(e.target.value)}
            />
            <button className="btn-secondary" onClick={handleConnectBNB} disabled={loading}>
              Conectar
            </button>
          </div>
          {wallet.bnbAddress && (
            <p style={{ color: '#00d4ff', fontSize: '0.85em', wordBreak: 'break-all' }}>
              Conectada: {wallet.bnbAddress}
            </p>
          )}
        </div>

        {wallet.bnbAddress && (
          <div>
            <h3 style={{ color: '#00d4ff', marginBottom: '10px' }}>💸 Retirar a BNB</h3>
            <div className="staking-input">
              <input
                type="number"
                placeholder="Cantidad"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <button className="btn-secondary" onClick={handleWithdraw} disabled={loading}>
                Retirar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Whitepaper Section */}
      <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '10px', textAlign: 'center', border: '1px solid #00d4ff' }}>
        <div className="construction">
          🏗️
        </div>
        <p className="construction-text">WHITEPAPER EN CONSTRUCCIÓN</p>
        <p style={{ color: '#999', fontSize: '0.85em', marginTop: '10px' }}>Próximamente disponible</p>
      </div>
    </div>
  );
}

export default WalletCard;