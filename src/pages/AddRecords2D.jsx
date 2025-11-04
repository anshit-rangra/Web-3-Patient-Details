import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthCare } from '../hooks/useHealthCare';
import Navbar2D from '../components/Navbar2D';
import './Pages2D.css';
import { useIpfsUpload } from '../hooks/useIpfsUpload';

const AddRecords2D = () => {
  const { addPatientRecord, isAuthorized, isConnected } = useHealthCare();
  const { uploadFile } = useIpfsUpload();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    recordId: '',
    patientName: '',
    diagnosis: '',
    treatment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload all files to IPFS
      const uploadPromises = files.map(file => uploadFile(file));
      const hashes = await Promise.all(uploadPromises);
      
      // Filter out any null values (failed uploads)
      const validHashes = hashes.filter(hash => hash !== null && hash !== undefined);
      
      // Check if all uploads succeeded
      if (validHashes.length !== files.length) {
        const failedCount = files.length - validHashes.length;
        alert(`⚠️ Warning: ${failedCount} image(s) failed to upload to IPFS. Continuing with ${validHashes.length} successful uploads.`);
      }
      
      // If no files were uploaded successfully, you might want to stop here
      if (files.length > 0 && validHashes.length === 0) {
        alert('❌ All image uploads failed. Please check your connection and try again.');
        setLoading(false);
        return;
      }
      
      const result = await addPatientRecord(
        formData.recordId,
        formData.patientName,
        formData.diagnosis,
        formData.treatment,
        validHashes
      );

      // const result = { success: true }; // --- IGNORE ---
      
      if (result.success) {
        alert('✅ Patient record added successfully!');
        
        // Reset form
        setFormData({
          recordId: '',
          patientName: '',
          diagnosis: '',
          treatment: ''
        });
        setFiles([]);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
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

                <div className="form-group full-width">
                  <label>Medical Files</label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      multiple
                      className="file-input-hidden"
                    />
                    <label htmlFor="file-upload" className="file-upload-btn">
                      <span className="upload-icon">📁</span>
                      <span className="upload-text">
                        {files.length > 0 ? `${files.length} file(s) selected` : 'Choose Files'}
                      </span>
                      <span className="upload-subtext">Click to browse</span>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="file-list">
                      <div className="file-list-header">
                        <span className="list-icon">📋</span>
                        <strong>Selected Files:</strong>
                      </div>
                      <ul className="file-items">
                        {files.map((file, index) => (
                          <li key={index} className="file-item">
                            <span className="file-icon">📄</span>
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
