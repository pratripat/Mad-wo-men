import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { Calendar, MapPin, Ticket, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TicketData {
  tokenId: string;
  eventId: string;
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
  };
  status: string;
  purchaseDate: string;
  nftTransactionHash?: string;
  nftMintSuccess?: boolean;
  nftBlockNumber?: number;
}

interface MyTicketsProps {
  walletState: {
    isConnected: boolean;
    address: string | null;
  };
  refreshTrigger?: number; // Trigger to refresh tickets
}

const MyTickets: React.FC<MyTicketsProps> = ({ walletState, refreshTrigger = 0 }) => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refresh tickets when refreshTrigger changes
  useEffect(() => {
    console.log('🔄 useEffect triggered:', { refreshTrigger, isConnected: walletState.isConnected, address: walletState.address });
    if (walletState.isConnected && walletState.address) {
      console.log('✅ Conditions met, calling fetchUserTickets');
      fetchUserTickets();
    } else {
      console.log('❌ Conditions not met, skipping fetch');
    }
  }, [refreshTrigger, walletState.isConnected, walletState.address]);

  const fetchUserTickets = async () => {
    if (!walletState.address) {
      console.log('❌ No wallet address, skipping fetch');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching tickets for wallet:', walletState.address);
      const response = await axios.get(`/api/tickets/user/${walletState.address}`);
      
      if (response.data.success) {
        console.log('✅ Tickets fetched successfully:', response.data.data);
        setTickets(response.data.data);
      } else {
        console.error('❌ Failed to fetch tickets:', response.data.message);
        setError('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'toBeAttended':
        return <Clock className="w-5 h-5" />;
      case 'Attended':
        return <CheckCircle className="w-5 h-5" />;
      case 'expired':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Ticket className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'toBeAttended':
        return 'text-yellow-600 bg-yellow-50';
      case 'Attended':
        return 'text-green-600 bg-green-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'toBeAttended':
        return 'To Be Attended';
      case 'Attended':
        return 'Attended';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  // Generate QR code data with actual NFT information
  const generateQRData = (ticket: TicketData) => {
    const qrData = {
      tokenId: ticket.tokenId,
      eventId: ticket.eventId,
      eventName: ticket.event.name,
      ownerAddress: walletState.address,
      nftTransactionHash: ticket.nftTransactionHash,
      nftMintSuccess: ticket.nftMintSuccess,
      nftBlockNumber: ticket.nftBlockNumber,
      status: ticket.status,
      purchaseDate: ticket.purchaseDate,
      // Add a timestamp for security
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(qrData);
  };

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view your tickets</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchUserTickets}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tickets</h1>
            <p className="text-xl text-gray-600">Manage and view your event tickets</p>
          </div>
          <button
            onClick={fetchUserTickets}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
        
        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Refresh Trigger: {refreshTrigger}</p>
          <p>Wallet Connected: {walletState.isConnected ? 'Yes' : 'No'}</p>
          <p>Wallet Address: {walletState.address || 'None'}</p>
          <p>Tickets Count: {tickets.length}</p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Tickets Yet</h2>
            <p className="text-gray-600 mb-6">Purchase tickets for events to see them here</p>
            <button
              onClick={() => window.location.href = '/events'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.tokenId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* QR Code Section */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-b border-gray-100">
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <QRCode
                        value={generateQRData(ticket)}
                        size={120}
                        level="H"
                        fgColor="#1f2937"
                        bgColor="#ffffff"
                      />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 mb-1">NFT Token ID</p>
                    <p className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      {ticket.tokenId}
                    </p>
                    {ticket.nftMintSuccess && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          ✅ Minted on Blockchain
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {ticket.event.name}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(ticket.status)}
                        <span>{getStatusText(ticket.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(ticket.event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{ticket.event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Ticket className="w-4 h-4 mr-2" />
                      <span>Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* NFT Information */}
                  {ticket.nftTransactionHash && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                      <p className="font-mono text-xs text-gray-700 break-all">
                        {ticket.nftTransactionHash}
                      </p>
                      {ticket.nftBlockNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          Block: {ticket.nftBlockNumber}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Wallet: {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                    </span>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;