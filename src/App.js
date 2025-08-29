import React from 'react';
import TicketQR from './components/TicketQR';
import CheckInScanner from './components/CheckInScanner';
import './App.css';

/**
 * Main App Component
 * Renders both the TicketQR generator and CheckInScanner side by side
 */
function App() {
  // Sample token data map for demonstration
  // In a real application, this would come from a database or API
  const tokenDataMap = {
    'TICKET001': {
      userName: 'John Doe',
      email: 'john.doe@email.com',
      eventName: 'Tech Conference 2024',
      seatNumber: 'A15',
      status: 'Confirmed'
    },
    'TICKET002': {
      userName: 'Jane Smith',
      email: 'jane.smith@email.com',
      eventName: 'Tech Conference 2024',
      seatNumber: 'B22',
      status: 'Confirmed'
    },
    'TICKET003': {
      userName: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      eventName: 'Tech Conference 2024',
      seatNumber: 'C08',
      status: 'Pending'
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎫 Event QR Code Check-In Prototype</h1>
        <p>Generate tickets and scan them for check-in verification</p>
      </header>
      
      <main className="app-main">
        {/* Left side - Ticket QR Generator */}
        <section className="ticket-section">
          <TicketQR />
        </section>
        
        {/* Right side - Check-In Scanner */}
        <section className="scanner-section">
          <CheckInScanner tokenDataMap={tokenDataMap} />
        </section>
      </main>
      
      <footer className="app-footer">
        <p>Built for hackathon demonstration • React + QR Code Technology</p>
      </footer>
    </div>
  );
}

export default App;
