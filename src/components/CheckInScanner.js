import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import './CheckInScanner.css';

/**
 * CheckInScanner Component
 * Scans QR codes and looks up token data from the provided tokenDataMap
 */
const CheckInScanner = ({ tokenDataMap }) => {
  // State for scanner
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  // Reference to the scanner component
  const scannerRef = useRef(null);

  // Add debug logging
  useEffect(() => {
    setDebugInfo('Scanner initialized. Waiting for QR codes...');
  }, []);

  /**
   * Handle successful QR code scan
   * @param {string} data - The scanned QR code data
   */
  const handleScan = (data) => {
    console.log('Raw scanned data:', data);
    setDebugInfo(`Raw data received: ${data ? data.substring(0, 100) : 'null'}`);
    
    if (data) {
      try {
        // Try to parse the scanned data as JSON
        const parsedData = JSON.parse(data);
        console.log('Parsed data:', parsedData);
        setScannedData(parsedData);
        setError(null);
        setDebugInfo(`Successfully parsed JSON data. Token ID: ${parsedData.tokenId}`);
        
        // Stop scanning after successful scan
        setIsScanning(false);
        
        console.log('QR Code scanned successfully:', parsedData);
      } catch (parseError) {
        // Handle invalid JSON data
        console.error('Parse error:', parseError);
        setError(`Invalid QR code format. Expected JSON data. Received: ${data.substring(0, 100)}`);
        setScannedData(null);
        setDebugInfo(`Parse failed: ${parseError.message}`);
      }
    } else {
      setDebugInfo('No data received from scanner');
    }
  };

  /**
   * Handle QR scanning errors
   * @param {Error} error - The error object
   */
  const handleError = (error) => {
    console.error('QR Scanner error:', error);
    setDebugInfo(`Scanner error: ${error.name} - ${error.message}`);
    
    // Check if it's a camera permission error
    if (error.name === 'NotAllowedError') {
      setCameraError('Camera access denied. Please allow camera permissions.');
    } else if (error.name === 'NotFoundError') {
      setCameraError('No camera found on this device.');
    } else if (error.name === 'NotSupportedError') {
      setCameraError('Camera not supported in this browser.');
    } else {
      setCameraError(`Camera error occurred: ${error.message}`);
    }
  };

  /**
   * Reset the scanner to scan another QR code
   */
  const handleReset = () => {
    setScannedData(null);
    setError(null);
    setCameraError(null);
    setIsScanning(true);
    setDebugInfo('Scanner reset. Ready to scan again...');
  };

  /**
   * Look up token data from the provided map
   * @param {string} tokenId - The token ID to look up
   * @returns {Object|null} The token data or null if not found
   */
  const lookupTokenData = (tokenId) => {
    const result = tokenDataMap[tokenId] || null;
    console.log(`Looking up token ${tokenId}:`, result);
    return result;
  };

  // Get the found token data if we have a scanned token
  const foundTokenData = scannedData ? lookupTokenData(scannedData.tokenId) : null;

  // Test function to simulate QR code scanning
  const testScan = () => {
    const testData = {
      tokenId: 'TICKET001',
      userName: 'John Doe',
      eventName: 'Tech Conference 2024',
      seatNumber: 'A15',
      timestamp: new Date().toISOString()
    };
    handleScan(JSON.stringify(testData));
  };

  return (
    <div className="checkin-scanner">
      <h2>📱 Check-In Scanner</h2>
      
      {/* Debug Information */}
      <div className="debug-info" style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '0.9rem'}}>
        <strong>Debug Info:</strong> {debugInfo}
      </div>
      
      {/* Test Button */}
      <div style={{textAlign: 'center', margin: '10px 0'}}>
        <button 
          onClick={testScan} 
          style={{
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🧪 Test Scan (TICKET001)
        </button>
      </div>
      
      {/* Camera Error Display */}
      {cameraError && (
        <div className="error-message camera-error">
          <p>🚫 {cameraError}</p>
          <button onClick={handleReset} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* QR Scanner */}
      {isScanning && !cameraError && (
        <div className="scanner-section">
          <div className="scanner-container">
            <QrScanner
              ref={scannerRef}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%', maxWidth: '400px' }}
              constraints={{
                video: {
                  facingMode: 'environment' // Use back camera on mobile
                }
              }}
            />
          </div>
          <p className="scanning-text">
            📷 Point camera at QR code to scan...
          </p>
        </div>
      )}

      {/* Scan Error Display */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={handleReset} className="retry-btn">
            Scan Again
          </button>
        </div>
      )}

      {/* Scanned Data Display */}
      {scannedData && (
        <div className="scanned-data">
          <h3>✅ QR Code Scanned Successfully!</h3>
          
          {/* Raw Scanned Data */}
          <div className="data-section">
            <h4>📋 Scanned Data:</h4>
            <pre className="json-display">{JSON.stringify(scannedData, null, 2)}</pre>
          </div>

          {/* Token Lookup Result */}
          <div className="data-section">
            <h4>🔍 Token Lookup Result:</h4>
            {foundTokenData ? (
              <div className="token-found">
                <div className="success-badge">✓ Token Found</div>
                <div className="token-details">
                  <h5>User Information:</h5>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Name:</strong> {foundTokenData.userName}
                    </div>
                    <div className="detail-item">
                      <strong>Email:</strong> {foundTokenData.email}
                    </div>
                    <div className="detail-item">
                      <strong>Event:</strong> {foundTokenData.eventName}
                    </div>
                    <div className="detail-item">
                      <strong>Seat:</strong> {foundTokenData.seatNumber}
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong> {foundTokenData.status}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="token-not-found">
                <div className="error-badge">❌ No Data Found</div>
                <p>
                  Token ID <strong>"{scannedData.tokenId}"</strong> was not found in the database.
                </p>
                <p className="note">
                  This could mean the ticket is invalid, expired, or not registered.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleReset} className="reset-btn">
              🔄 Scan Another QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInScanner;
