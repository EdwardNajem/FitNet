import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

// Create context
const TrainerRequestContext = createContext();

// Provider component
const TrainerRequestProvider = ({ children }) => {
  const [trainerRequestStatus, setTrainerRequestStatus] = useState(null);

  // Load status from AsyncStorage
  useEffect(() => {
    const loadStatus = async () => {
      const status = await AsyncStorage.getItem('@trainerRequestStatus');
      setTrainerRequestStatus(status);
    };

    loadStatus();
  }, []);

  // Save status to AsyncStorage
  useEffect(() => {
    const saveStatus = async () => {
      await AsyncStorage.setItem('@trainerRequestStatus', trainerRequestStatus || '');
    };

    saveStatus();
  }, [trainerRequestStatus]);

  return (
    <TrainerRequestContext.Provider value={{ trainerRequestStatus, setTrainerRequestStatus }}>
      {children}
    </TrainerRequestContext.Provider>
  );
};

export { TrainerRequestContext, TrainerRequestProvider };
