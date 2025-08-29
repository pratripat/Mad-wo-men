import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './QrCheckIn.css';

const QrCheckIn = () => {
  const [scannedToken, setScannedToken] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    // Initialize QR scanner when component mounts
    initScanner();
    
    // Cleanup on unmount
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear();
      }
    };
  }, []);

  const initScanner = () => {
    try {
      setError(null);
      setIsScanning(true);
      
      qrScannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      qrScannerRef.current.render(onScanSuccess, onScanFailure);
      
    } catch (err) {
      setError('Failed to initialize camera. Please check camera permissions.');
      setIsScanning(false);
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    try {
      // Extract token ID from scanned QR code
      const tokenId = decodedText.trim();
      
      if (tokenId) {
        setScannedToken(tokenId);
        setError(null);
        
        // Stop scanning after successful scan
        if (qrScannerRef.current) {
          qrScannerRef.current.clear();
          setIsScanning(false);
        }
        
        // Optional: Add success feedback
        console.log('QR Code scanned successfully:', tokenId);
      }
    } catch (err) {
      setError('Failed to process scanned QR code.');
    }
  };

  const onScanFailure = (error) => {
    // Only show error if it's not a normal scanning process
    if (error && !error.includes('QR code not found')) {
      setError('Failed to scan QR code. Please try again.');
    }
  };

  const handleReset = () => {
    setScannedToken(null);
    setError(null);
    setIsScanning(false);
    
    // Clear existing scanner
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
    }
    
    // Reinitialize scanner
    setTimeout(() => {
      initScanner();
    }, 100);
  };

  const handleRetry = () => {
    setError(null);
    initScanner();
  };

  return (
    <div className="qr-checkin">
      <div className="container">
        <h1 className="heading">Event Check-In</h1>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {!scannedToken && !error && (
          <div className="scanner-section">
            <div id="qr-reader" className="qr-reader"></div>
            {isScanning && (
              <p className="scanning-text">Point camera at QR code...</p>
            )}
          </div>
        )}

        {scannedToken && (
          <div className="result-section">
            <div className="success-message">
              <h2>✓ Check-In Successful!</h2>
              <div className="token-display">
                <label>Scanned Token ID:</label>
                <span className="token-value">{scannedToken}</span>
              </div>
            </div>
            <button onClick={handleReset} className="reset-btn">
              Scan Another QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCheckIn;
