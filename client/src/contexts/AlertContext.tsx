import React, { createContext, useContext, useState } from 'react';
import { Alert, AlertTitle } from '@mui/material';


interface AlertState {
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
    details?: string;
}

interface AlertContextProps {
    showAlert: (message: string, severity: 'success' | 'info' | 'warning' | 'error', details?: string) => void;   
}

// Alert context
export const AlertContext = createContext<AlertContextProps | undefined>(undefined);


// Alert provider
interface AlertProviderProps {
    children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alert, setAlert] = useState<AlertState | null>(null);

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDetails = () => setIsExpanded(!isExpanded);
  
    const showAlert = (message: string, severity: 'success' | 'info' | 'warning' | 'error', details?: string) => {
      setAlert({ message, severity, details });
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
                      {alert.details && (
                        <div style={{ marginTop: '10px' }}>
                          <button
                            onClick={toggleDetails}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#007bff',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            {isExpanded ? 'Less Details' : 'More Details'}
                          </button>
                          {isExpanded && (
                            <pre
                              style={{
                                marginTop: '10px',
                                backgroundColor: '#f1f1f1',
                                margin: '0 auto',
                                textAlign: 'center',
                                padding: '10px',
                                borderRadius: '4px',
                                overflowX: 'auto', // Enables horizontal scrolling
                                whiteSpace: 'pre-wrap', // Wraps long lines instead of stretching
                                wordWrap: 'break-word', // Breaks words if they are too long
                                maxHeight: '150px', // Limits height and adds vertical scrolling
                                overflowY: 'auto', // Enables vertical scrolling if content exceeds maxHeight
                                fontFamily: 'monospace',
                              }}
                            >
                              {alert.details}
                            </pre>
                          )}
                        </div>
                      )}
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