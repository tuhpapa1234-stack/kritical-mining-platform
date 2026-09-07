import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MiningCard from '../components/MiningCard';
import WalletCard from '../components/WalletCard';
import StakingCard from '../components/StakingCard';
import ReferralCard from '../components/ReferralCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function DashboardPage({ token, user, onLogout }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API}/api/mining/stats/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏆 Dashboard - Kritical</h1>
        <button className="logout-btn" onClick={onLogout}>Salir</button>
      </div>

      <div className="dashboard-grid">
        <MiningCard token={token} userData={userData} onRefresh={fetchUserData} />
        <WalletCard token={token} userData={userData} onRefresh={fetchUserData} />
        <StakingCard token={token} userData={userData} onRefresh={fetchUserData} />
        <ReferralCard token={token} userData={userData} onRefresh={fetchUserData} />
      </div>
    </div>
  );
}

export default DashboardPage;