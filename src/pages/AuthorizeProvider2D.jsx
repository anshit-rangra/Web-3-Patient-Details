import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthCare } from '../hooks/useHealthCare';
import Navbar2D from '../components/Navbar2D';
import './Pages2D.css';

const AuthorizeProvider2D = () => {
  const { authorizeProvider, isOwner, loading, currentAccountAddress } = useHealthCare();
  const navigate = useNavigate();
  
  const [providerAddress, setProviderAddress] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleAuthorize = async (e) => {
    e.preventDefault();

    // Validation
    if (!isOwner) {
      showNotification('⚠️ Only the contract owner can authorize providers', 'error');
      return;
    }

    if (!providerAddress.trim()) {
      showNotification('⚠️ Please enter a provider address', 'error');
      return;
    }

    // Check if it's a valid Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(providerAddress.trim())) {
      showNotification('⚠️ Invalid Ethereum address format', 'error');
      return;
    }


    try {
      const result = await authorizeProvider(providerAddress.trim());
      
      if (result.success) {
        showNotification('✅ Provider authorized successfully!', 'success');
        setProviderAddress('');
      } else {
        showNotification(`❌ ${result.message}`, 'error');
      }
    } catch {
      showNotification('❌ Failed to authorize provider', 'error');
    }
  };

  // If not owner, show access denied
  if (!isOwner) {
    return (
      <div className="page-container">
        <div className="animated-bg">
          <div className="grid-lines"></div>
        </div>
        <Navbar2D />
        
        <div className="content-wrapper">
          <div className="access-denied-card">
            <div className="access-denied-icon">🚫</div>
            <h2 className="access-denied-title">ACCESS DENIED</h2>
            <p className="access-denied-text">
              Only the contract owner can authorize healthcare providers.
            </p>
            <button 
              className="back-button"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="grid-lines"></div>
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i % 3}`}></div>
        ))}
      </div>

      {/* Navigation */}
      <Navbar2D />

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="form-container">
          {/* Header */}
          <div className="form-header">
            <h1 className="form-title">
              <span className="title-icon">🔐</span>
              AUTHORIZE PROVIDER
            </h1>
            <p className="form-subtitle">
              Grant blockchain access to healthcare providers
            </p>
          </div>

          {/* Owner Badge */}
          <div className="owner-info-card">
            <div className="owner-badge-large">
              <span className="crown-icon">👑</span>
              <div>
                <h3>CONTRACT OWNER</h3>
                <p className="owner-address">
                  {currentAccountAddress.slice(0, 10)}...{currentAccountAddress.slice(-8)}
                </p>
              </div>
            </div>
          </div>

          {/* Authorization Form */}
          <form onSubmit={handleAuthorize} className="data-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📍</span>
                Provider Wallet Address
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="0x..."
                value={providerAddress}
                onChange={(e) => setProviderAddress(e.target.value)}
                disabled={loading}
              />
              <span className="input-helper">
                Enter the Ethereum address of the healthcare provider
              </span>
            </div>

            {/* Information Card */}
            <div className="info-card">
              <h4 className="info-title">⚡ Authorization Details</h4>
              <ul className="info-list">
                <li>✓ Provider can add patient records</li>
                <li>✓ Provider can view all patient records</li>
                <li>✓ Authorization is permanent (blockchain immutable)</li>
                <li>⚠️ Double-check the address before authorizing</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  PROCESSING...
                </>
              ) : (
                <>
                  <span className="button-icon">🔓</span>
                  AUTHORIZE PROVIDER
                </>
              )}
            </button>
          </form>

          {/* Back Button */}
          <button 
            className="back-button"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            ← Back to Home
          </button>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <h3 className="tips-title">💡 AUTHORIZATION TIPS</h3>
          <div className="tip-card">
            <div className="tip-icon">🔍</div>
            <div className="tip-content">
              <h4>Verify Address</h4>
              <p>Always double-check the provider's wallet address before authorization</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔒</div>
            <div className="tip-content">
              <h4>Permanent Access</h4>
              <p>Once authorized, the provider will have permanent access to the system</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⛽</div>
            <div className="tip-content">
              <h4>Gas Fees</h4>
              <p>This transaction requires gas fees to be paid on the blockchain</p>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📋</div>
            <div className="tip-content">
              <h4>Provider Rights</h4>
              <p>Authorized providers can add and view patient records but cannot authorize others</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizeProvider2D;
