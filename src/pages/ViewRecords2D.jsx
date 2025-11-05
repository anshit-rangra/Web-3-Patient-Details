import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthCare } from '../hooks/useHealthCare';
import Navbar2D from '../components/Navbar2D';
import './Pages2D.css';

const ViewRecords2D = () => {
  const { getPatientRecord, isAuthorized, isConnected, getHospitalName } = useHealthCare();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedRecords, setParsedRecords] = useState([]);

  const handleSearch = async () => {
    if (!patientId.trim()) {
      setError('Please enter a patient ID');
      return;
    }

    setLoading(true);
    setError('');
    setRecord(null);
    setParsedRecords([]);

    try {
      const response = await getPatientRecord(patientId);
      
      if (response.success && response.data && response.data.length > 0) {
        setRecord({
          id: patientId,
          data: response.data,
          timestamp: new Date().toLocaleString()
        });
        
        // Parse records immediately after setting record
        const parsed = await parseRecordData(response.data);
        setParsedRecords(parsed);
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
  
  


  const parseRecordData = async (dataArray) => {
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
      const recordPromises = dataArray.map(async (record) => {
        const fields = {};
        
        
        
        if (record[1]) fields['Patient Name'] = record[1];
        if (record[2]) fields['Diagnosis'] = record[2];
        if (record[3]) fields['Treatment'] = record[3];
        
        // Handle IPFS hashes
        if (record[4] && Array.isArray(record[4])) {
          fields['ipfsHashes'] = record[4];
        }

        if (record[5]) {
          const hospitalName = await getHospitalName(record[5]);
          fields['Hospital'] = hospitalName.data;
        }
        
        if (record[6]) {
          const timestamp = typeof record[6] === 'bigint'
            ? Number(record[6])
            : parseInt(record[6]);
          fields['Timestamp'] = new Date(timestamp * 1000).toLocaleString();
        }
        
        return fields;
      });
      
      // Wait for all promises to resolve
      return await Promise.all(recordPromises);
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
                {parsedRecords.length > 0 && parsedRecords[0]['Patient Name']}
                
                <br />
                Patient Records for ID #{record.id} 
              </h2>
              <span className="record-badge">✅ Verified on Blockchain</span>
            </div>

            <div className="record-content">
              {parsedRecords.length > 0 && [...parsedRecords].reverse().map((fields, idx) => {
                const ipfsHashes = fields['ipfsHashes'];
                const fieldsWithoutIpfs = Object.entries(fields).filter(
                  ([key]) => key !== 'ipfsHashes'
                );
                
                return (
                  <div key={idx} className="record-section">
                    {parsedRecords.length > 1 && (
                      <h3 className="record-section-title">Record {parsedRecords.length - idx}</h3>
                    )}
                    
                    
                    <div className="record-grid">
                      {fieldsWithoutIpfs.map(([key, value]) => (
                        <div key={key} className="record-field">
                          <label className="field-label">{key}</label>
                          <div className="field-value">{value}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Display IPFS Images */}
                    {ipfsHashes && ipfsHashes.length > 0 && (
                      <div className="ipfs-images-section">
                        <h4 className="ipfs-section-title">
                          📸 Medical Images ({ipfsHashes.length})
                        </h4>
                        <div className="ipfs-images-grid">
                          {ipfsHashes.map((hash, imgIdx) => (
                            <div key={imgIdx} className="ipfs-image-card">
                              <div className="image-wrapper">
                                <img 
                                  src={`https://gateway.pinata.cloud/ipfs/${hash}`}
                                  alt={`Medical image ${imgIdx + 1}`}
                                  className="medical-image"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                                  }}
                                />
                              </div>
                              <div className="image-info">
                                <span className="image-number">Image {imgIdx + 1}</span>
                                <a 
                                  href={`https://gateway.pinata.cloud/ipfs/${hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="view-full-link"
                                >
                                  🔗 View Full
                                </a>
                              </div>
                              <div className="ipfs-hash-display">
                                <span className="hash-label">IPFS:</span>
                                <code className="hash-code">{hash.substring(0, 10)}...{hash.substring(hash.length - 8)}</code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
