import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthCare } from '../hooks/useHealthCare';
import Navbar2D from '../components/Navbar2D';
import './Home2D.css';

const Home2D = () => {
  const { isConnected, currentAccountAddress, isOwner } = useHealthCare();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Add Patient Records',
      description: 'Securely store patient information on blockchain with cryptographic security',
      icon: '📝',
      route: '/add-records'
    },
    {
      title: 'View Medical Records',
      description: 'Access complete patient history with full transparency and audit trails',
      icon: '👁️',
      route: '/view-records'
    },
    {
      title: 'Provider Authorization',
      description: 'Manage healthcare provider access with advanced permission controls',
      icon: '🔐',
      route: '/authorize-provider'
    }
  ];

  const benefits = [
    { icon: '🛡️', title: 'Enhanced Security', description: 'Military-grade blockchain encryption' },
    { icon: '🌐', title: 'Decentralized', description: 'No single point of failure' },
    { icon: '👀', title: 'Transparent', description: 'Immutable audit trails' },
    { icon: '⚡', title: 'Instant Access', description: 'Lightning-fast retrieval' }
  ];

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="grid-lines"></div>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i % 3}`}></div>
        ))}
      </div>

      {/* Navigation */}
      <Navbar2D />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line title-cyan">BLOCKCHAIN</span>
            <span className="title-line title-magenta">HEALTHCARE</span>
            <span className="title-line title-green">SYSTEM</span>
          </h1>
          <p className="hero-subtitle">
            Next-Generation Medical Records Management
            <br />
            Powered by Decentralized Blockchain Technology
          </p>
        </div>

        {/* Connection Status */}
        {isConnected && (
          <div className="connection-card">
            <div className="connection-icon">✅</div>
            <div className="connection-info">
              <h3 className="connection-title">WALLET CONNECTED</h3>
              <p className="connection-address">
                {currentAccountAddress.slice(0, 8)}...{currentAccountAddress.slice(-6)}
              </p>
              {isOwner && (
                <span className="owner-badge">👑 CONTRACT OWNER</span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">EXPLORE FEATURES</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              onClick={() => navigate(feature.route)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <button className="feature-button">
                Explore →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2 className="section-title">WHY BLOCKCHAIN HEALTHCARE?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-content">
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 HealthChain • Secure • Transparent • Decentralized</p>
      </footer>
    </div>
  );
};

export default Home2D;
