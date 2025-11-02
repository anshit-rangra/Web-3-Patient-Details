import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthCareProvider } from './context/HealthCareContext.jsx';
import Home2D from './pages/Home2D';
import AddRecords2D from './pages/AddRecords2D';
import ViewRecords2D from './pages/ViewRecords2D';
import AuthorizeProvider2D from './pages/AuthorizeProvider2D';
import './index.css';

const App = () => {
  return (
    <HealthCareProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home2D />} />
            <Route path="/add-records" element={<AddRecords2D />} />
            <Route path="/view-records" element={<ViewRecords2D />} />
            <Route path="/authorize-provider" element={<AuthorizeProvider2D />} />
          </Routes>
        </div>
      </Router>
    </HealthCareProvider>
  );
};

export default App;
