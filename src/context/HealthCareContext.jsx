import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../assets/abi.json';


// eslint-disable-next-line react-refresh/only-export-components
export const HealthCareContext = React.createContext();

export const HealthCareProvider = ({ children }) => {
    const [isOwner, setIsOwner] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [currentAccountAddress, setCurrentAccountAddress] = useState('');
    const [smartContract, setSmartContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    
    const contractAddress = "0x0Dc41d25065E6c59f91a927035Be478D3004F2fA";

    useEffect(() => {
        connectWallet();
    }, []);

    const connectWallet = async () => {
        try {
            setLoading(true);
            if (!window.ethereum) {
                alert("Please install MetaMask wallet");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const signer = await provider.getSigner();
            const accountAddress = await signer.getAddress();

            setCurrentAccountAddress(accountAddress);
            setIsConnected(true);

            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            setSmartContract(contract);

            const owner = await contract.getOwner();
            const ownerStatus = accountAddress.toLowerCase() === owner.toLowerCase();
            setIsOwner(ownerStatus);

            // Check if the user is authorized
            const authorized = await contract.authorizedUser(accountAddress);
            setIsAuthorized(authorized || ownerStatus); // Owner is always authorized
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet");
        } finally {
            setLoading(false);
        }
    };

    

    const authorizeProvider = async (providerAddress) => {
        try {
            setLoading(true);
            if (!smartContract) {
                throw new Error("Smart contract not connected");
            }
            
            const tx = await smartContract.authorizeTheProvider(providerAddress);
            await tx.wait();
            return { success: true, message: "Provider authorized successfully!" };
        } catch (error) {
            console.error("Error authorizing provider:", error);
            return { success: false, message: "Failed to authorize provider" };
        } finally {
            setLoading(false);
        }
    };

    const addPatientRecord = async (patientId, patientName, diagnosis, treatment) => {
        try {
            setLoading(true);
            if (!smartContract) {
                throw new Error("Smart contract not connected");
            }
            
            const tx = await smartContract.addPatientRecord(patientId, patientName, diagnosis, treatment);
            await tx.wait();
            return { success: true, message: "Patient record added successfully!" };
        } catch (error) {
            console.error("Error adding patient record:", error);
            return { success: false, message: "Failed to add patient record" };
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientRecords = async (patientId) => {
        try {
            setLoading(true);
            if (!smartContract) {
                throw new Error("Smart contract not connected");
            }
            
            const records = await smartContract.fetchAllRecords(patientId);
            return { success: true, data: records };
        } catch (error) {
            console.error("Error fetching patient records:", error);
            return { success: false, message: "Failed to fetch patient records" };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        isOwner,
        isAuthorized,
        currentAccountAddress,
        smartContract,
        loading,
        isConnected,
        connectWallet,
        authorizeProvider,
        addPatientRecord,
        fetchPatientRecords,
        getPatientRecord: fetchPatientRecords // Add alias for compatibility
    };

    return (
        <HealthCareContext.Provider value={value}>
            {children}
        </HealthCareContext.Provider>
    );
};