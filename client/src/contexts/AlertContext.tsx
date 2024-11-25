import React, { createContext, useContext, useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';


interface AlertState {
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}

interface AlertContextProps {
    showAlert: (message: string, severity: 'success' | 'info' | 'warning' | 'error') => void;   
}

// Alert context
export const AlertContext = createContext<AlertContextProps | undefined>(undefined);


// Alert provider
interface AlertProviderProps {
    children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alert, setAlert] = useState<AlertState | null>(null);
  
    const showAlert = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
      setAlert({ message, severity });
      // If alert is success or info set timeout
        if (severity === 'success' || severity === 'info'){
            setTimeout(() => setAlert(null), 4500); // Auto-dismiss after 3 seconds
        }
    };
  
    return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className='alert-container'>
        {(() => {
          switch (alert.severity) {
            case 'error':
                return (
                    <Alert severity={alert.severity} className='alert' icon={false} onClose={() => setAlert(null)}>
                      <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
                      {alert.message}
                    </Alert>
                  );
            case 'warning':
                return (
                <Alert severity={alert.severity} className='alert' icon={false} onClose={() => setAlert(null)}>
                    <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
                    {alert.message}
                </Alert>
                );
            case 'success':
                return (
                <Alert severity={alert.severity} className='alert' icon={false}>
                    <AlertTitle>{alert.severity.toUpperCase()}</AlertTitle>
                    {alert.message}
                </Alert>
                );
            case 'info':
                return (
                <Alert severity={alert.severity} className='alert' icon={false}>
                    {alert.message}
                </Alert>
                );
            default:
            return (
              <Alert severity={alert.severity} className='alert' icon={false}>
                {alert.message}
              </Alert>
            );
          }
        })()}
        </div>
      )}
    </AlertContext.Provider>
    );
  };
  
  // Custom hook to access the context
  export const useAlert = (): AlertContextProps => {
    const context = useContext(AlertContext);
    if (!context) {
      throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
  };