import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthCare } from '../hooks/useHealthCare';
import Navbar2D from '../components/Navbar2D';
import './Pages2D.css';

const ViewRecords2D = () => {
  const { getPatientRecord, isAuthorized, isConnected } = useHealthCare();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!patientId.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    setLoading(true);
    setError('');
    setRecord(null);

    try {
      const response = await getPatientRecord(patientId);

      
      if (response.success && response.data && response.data.length > 0) {
        setRecord({
          id: patientId,
          data: response.data,
          timestamp: new Date().toLocaleString()
        });
      } else {
        setError('No record found for this patient ID');
      }
    } catch (err) {
      console.error('Error fetching record:', err);
      setError('Failed to fetch patient record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const parseRecordData = (dataArray) => {
    // Handle if dataArray is a string (for backward compatibility)
    if (typeof dataArray === 'string') {
      const fields = {};
      const pairs = dataArray.split(',');
      
      pairs.forEach(pair => {
        const [key, value] = pair.split(':').map(s => s.trim());
        if (key && value) {
          // Format timestamp if it exists
          if (key === 'Timestamp') {
            const timestamp = parseInt(value);
            fields[key] = new Date(timestamp * 1000).toLocaleString();
          } else {
            fields[key] = value;
          }
        }
      });
      
      return [fields];
    }
    
    // Handle array of records from blockchain
    if (Array.isArray(dataArray)) {
      return dataArray.map((record) => {
        // Check if record has expected fields
        if (typeof record === 'object' && record !== null) {
          const fields = {};
          
          // Common blockchain record structure
          if (record.patientName) fields['Patient Name'] = record.patientName;
          if (record.diagnosis) fields['Diagnosis'] = record.diagnosis;
          if (record.treatment) fields['Treatment'] = record.treatment;
          if (record.timestamp) {
            const timestamp = typeof record.timestamp === 'bigint' 
              ? Number(record.timestamp) 
              : parseInt(record.timestamp);
            fields['Timestamp'] = new Date(timestamp * 1000).toLocaleString();
          }
          
          return fields;
        }
        
        return { 'Record': String(record) };
      });
    }
    
    // Fallback: convert to string representation
    return [{ 'Data': String(dataArray) }];
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
              <p>You are not authorized to view patient records.</p>
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
            <span className="title-icon">👁️</span>
            View Patient Records
          </h1>
          <p className="page-subtitle">Access complete patient medical history from the blockchain</p>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Patient ID (e.g., 1, 2, 3...)"
              className="search-input"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              className="search-button"
              disabled={loading}
            >
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {/* Record Display */}
        {record && (
          <div className="record-container">
            <div className="record-header">
              <h2>
                {record.data[0][1]}
                <br />
                Patient Records for ID #{record.id} 
              </h2>
              <span className="record-badge">✅ Verified on Blockchain</span>
            </div>

            <div className="record-content">
              {(() => {
                const recordsArray = parseRecordData(record.data);
                return recordsArray?.reverse().map((fields, idx) => (
                  <div key={idx} className="record-section">
                    {recordsArray.length > 1 && (
                      <h3 className="record-section-title">Record - {idx + 1}</h3>
                    )}
                    <div className="record-grid">
                      {Object.entries(fields).map(([key, value]) => (
                        <div key={key} className="record-field">
                          <label className="field-label">{key}</label>
                          <div className="field-value">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="record-footer">
              <div className="record-info">
                <span className="info-icon">🕒</span>
                <span>Retrieved: {record.timestamp}</span>
              </div>
              <div className="record-info">
                <span className="info-icon">🔗</span>
                <span>Stored on Blockchain</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!record && !error && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Records Displayed</h3>
            <p>Enter a patient ID above to view their medical records</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRecords2D;
