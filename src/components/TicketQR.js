import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import './TicketQR.css';

/**
 * TicketQR Component
 * Generates QR codes for event tickets with tokenId and optional event data
 */
const TicketQR = () => {
  // State for form inputs
  const [tokenId, setTokenId] = useState('TICKET001');
  const [userName, setUserName] = useState('John Doe');
  const [eventName, setEventName] = useState('Tech Conference 2024');
  const [seatNumber, setSeatNumber] = useState('A15');
  const [debugInfo, setDebugInfo] = useState('');
  
  // Generate QR code data as JSON string
  const generateQRData = () => {
    const ticketData = {
      tokenId: tokenId,
      userName: userName,
      eventName: eventName,
      seatNumber: seatNumber,
      timestamp: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(ticketData, null, 2);
    console.log('Generated QR data:', jsonString);
    setDebugInfo(`Generated QR data: ${jsonString.substring(0, 100)}...`);
    
    return jsonString;
  };

  // Get the current QR data
  const qrData = generateQRData();

  // Update debug info when form changes
  useEffect(() => {
    setDebugInfo(`Current form data - Token: ${tokenId}, User: ${userName}, Event: ${eventName}, Seat: ${seatNumber}`);
  }, [tokenId, userName, eventName, seatNumber]);

  return (
    <div className="ticket-qr">
      <h2>🎫 Generate Event Ticket</h2>
      
      {/* Debug Information */}
      <div className="debug-info" style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '0.9rem'}}>
        <strong>Debug Info:</strong> {debugInfo}
      </div>
      
      {/* Form for ticket data */}
      <div className="ticket-form">
        <div className="form-group">
          <label htmlFor="tokenId">Token ID:</label>
          <input
            type="text"
            id="tokenId"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter token ID"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="userName">User Name:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="seatNumber">Seat Number:</label>
          <input
            type="text"
            id="seatNumber"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
            placeholder="Enter seat number"
          />
        </div>
      </div>

      {/* QR Code Display */}
      <div className="qr-display">
        <div className="qr-container">
          <QRCode 
            value={qrData}
            size={200}
            level="M"
            includeMargin={true}
          />
        </div>
        
        {/* Ticket Information Display */}
        <div className="ticket-info">
          <h3>Ticket Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Token ID:</strong> {tokenId}
            </div>
            <div className="info-item">
              <strong>User:</strong> {userName}
            </div>
            <div className="info-item">
              <strong>Event:</strong> {eventName}
            </div>
            <div className="info-item">
              <strong>Seat:</strong> {seatNumber}
            </div>
          </div>
        </div>
      </div>

      {/* QR Data Preview */}
      <div className="qr-data-preview">
        <h4>QR Code Data (JSON):</h4>
        <pre className="json-display">{qrData}</pre>
        <p className="instruction">
          📱 Scan this QR code with the Check-In Scanner to verify the ticket
        </p>
      </div>
    </div>
  );
};

export default TicketQR;
