import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar2D.css';

const Navbar2D = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')}>
        <span className="logo-icon">🏥</span>
        <span className="logo-text">HealthChain</span>
      </div>
      <div className="nav-links">
        <button 
          onClick={() => navigate('/')} 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/add-records')} 
          className={`nav-link ${isActive('/add-records') ? 'active' : ''}`}
        >
          Add Records
        </button>
        <button 
          onClick={() => navigate('/view-records')} 
          className={`nav-link ${isActive('/view-records') ? 'active' : ''}`}
        >
          View Records
        </button>
      </div>
    </nav>
  );
};

export default Navbar2D;
