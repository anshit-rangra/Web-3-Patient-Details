import { useContext } from 'react';
import { HealthCareContext } from '../context/HealthCareContext.jsx';

export const useHealthCare = () => {
    const context = useContext(HealthCareContext);
    if (!context) {
        throw new Error('useHealthCare must be used within a HealthCareProvider');
    }
    return context;
};