import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthCare } from '../hooks/useHealthCare';
import Navbar2D from '../components/Navbar2D';
import './Pages2D.css';

const AddRecords2D = () => {
  const { addPatientRecord, isAuthorized, isConnected } = useHealthCare();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recordId: '',
    patientName: '',
    diagnosis: '',
    treatment: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Call addPatientRecord with the correct parameters
      const result = await addPatientRecord(
        formData.recordId,
        formData.patientName,
        formData.diagnosis,
        formData.treatment
      );
      
      if (result.success) {
        alert('✅ Patient record added successfully!');
        
        // Reset form
        setFormData({
          recordId: '',
          patientName: '',
          diagnosis: '',
          treatment: ''
        });
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding record:', error);
      alert('❌ Failed to add patient record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authorized
  if (!isConnected) {
    return (
      <div className="page-container">
        <div className="animated-bg">
          <div className="grid-lines"></div>
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 3}`}></div>
          ))}
        </div>
        <Navbar2D />
        <div className="page-content">
          <div className="unauthorized-container">
            <div className="unauthorized-card">
              <span className="unauthorized-icon">🔌</span>
              <h2>Wallet Not Connected</h2>
              <p>Please connect your wallet to access this page.</p>
              <button onClick={() => navigate('/')} className="btn btn-primary">
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="page-container">
        <div className="animated-bg">
          <div className="grid-lines"></div>
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 3}`}></div>
          ))}
        </div>
        <Navbar2D />
        <div className="page-content">
          <div className="unauthorized-container">
            <div className="unauthorized-card">
              <span className="unauthorized-icon">🚫</span>
              <h2>Access Denied</h2>
              <p>You are not authorized to add patient records.</p>
              <p className="unauthorized-subtext">
                Only authorized healthcare providers can access this page.
                Please contact the system administrator.
              </p>
              <button onClick={() => navigate('/')} className="btn btn-primary">
                Go to Home
              </button>
            </div>
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
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">📝</span>
            Add Patient Record
          </h1>
          <p className="page-subtitle">Securely store patient information on the blockchain</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="medical-form">
            <div className="form-section">
              <h3 className="section-title">Patient Record Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Record ID *</label>

                  <input
                    type="number"
                    name="recordId"
                    value={formData.recordId}
                    onChange={handleChange}
                    placeholder="Enter unique record ID"
                    required
                    className="form-input"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter patient full name"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Diagnosis *</label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    placeholder="Enter diagnosis details and medical condition"
                    required
                    className="form-input"
                    rows="4"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Treatment *</label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    placeholder="Enter treatment plan and prescribed medications"
                    required
                    className="form-input"
                    rows="4"
                  />
                </div>
              </div>

              <div className="timestamp-info">
                <div className="info-box">
                  <span className="info-icon">🕒</span>
                  <div className="info-text">
                    <strong>Timestamp:</strong> Will be automatically recorded when you submit
                  </div>
                </div>
                <div className="info-box">
                  <span className="info-icon">🔒</span>
                  <div className="info-text">
                    <strong>Blockchain Storage:</strong> Record will be stored immutably on-chain
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '⏳ Adding Record...' : '✅ Add Patient Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecords2D;
