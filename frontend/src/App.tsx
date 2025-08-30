import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:3002';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Wallet, 
  Users, 
  Shield, 
  Star,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image: string;
  totalTickets: number;
  soldTickets: number;
}

interface NFTTicket {
  tokenId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  status: 'unused' | 'used' | 'expired';
  purchaseDate: string;
}

interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
}

// Header Component
const Header: React.FC<{
  currentView: string;
  setCurrentView: (view: string) => void;
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}> = ({ currentView, setCurrentView, walletState, connectWallet, disconnectWallet }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', key: 'landing' },
    { name: 'Events', key: 'events' },
    { name: 'My Tickets', key: 'dashboard' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentView('landing')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MAD(wo)MEN
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentView === item.key
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {walletState.isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={walletState.isConnecting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>{walletState.isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setCurrentView(item.key);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium transition-colors duration-200 ${
                    currentView === item.key
                      ? 'text-purple-600'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-gray-200">
                {walletState.isConnected ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">
                        {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      connectWallet();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={walletState.isConnecting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{walletState.isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Landing Page Component
const Landing: React.FC<{
  setCurrentView: (view: string) => void;
}> = ({ setCurrentView }) => {
  const features = [
    {
      icon: Shield,
      title: 'Fraud-Proof Tickets',
      description: 'Blockchain-verified NFTs make counterfeiting impossible'
    },
    {
      icon: Star,
      title: 'Digital Collectibles',
      description: 'Tickets transform into collectible badges after events'
    },
    {
      icon: Users,
      title: 'Loyalty Rewards',
      description: 'Collect badges and unlock exclusive perks and benefits'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Future of
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Event Ticketing
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience fraud-proof NFT tickets that transform into collectible badges, 
              creating lasting value and building your event loyalty portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentView('events')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Explore Events</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Ticket className="w-5 h-5" />
                <span>My Tickets</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose NFT Tickets?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Revolutionary technology meets seamless user experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Events Page Component
const Events: React.FC<{
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  purchaseTicket: (eventId: string) => Promise<void>;
}> = ({ walletState, connectWallet, purchaseTicket }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    console.log('Fetching events...');
    try {
      const response = await axios.get('/api/tickets/events');
      console.log('Events response:', response.data);
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (eventId: string) => {
    if (!walletState.isConnected) {
      await connectWallet();
      return;
    }

    setPurchasing(eventId);
    try {
      await purchaseTicket(eventId);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing events and secure your NFT tickets
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover mix-blend-overlay"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-900">
                    ${event.price}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.soldTickets}/{event.totalTickets} sold</span>
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(event.id)}
                  disabled={purchasing === event.id || event.soldTickets >= event.totalTickets}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {purchasing === event.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : event.soldTickets >= event.totalTickets ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>
                        {walletState.isConnected ? 'Purchase Ticket' : 'Connect & Purchase'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Available
            </h3>
            <p className="text-gray-600">
              Check back soon for exciting upcoming events!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard: React.FC<{
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  setCurrentView: (view: string) => void;
}> = ({ walletState, connectWallet }) => {
  const [tickets, setTickets] = useState<NFTTicket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletState.isConnected && walletState.address) {
      fetchUserTickets();
    }
  }, [walletState.isConnected, walletState.address]);

  const fetchUserTickets = async () => {
    if (!walletState.address) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/tickets/owner/${walletState.address}`);
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const generateQRData = (ticket: NFTTicket) => {
    return JSON.stringify({
      tokenId: ticket.tokenId,
      eventId: ticket.eventId,
      eventTitle: ticket.eventTitle,
      ownerAddress: walletState.address
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unused': return 'text-green-600 bg-green-50';
      case 'used': return 'text-blue-600 bg-blue-50';
      case 'expired': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Wallet className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Connect your Coinbase Wallet to view and manage your NFT tickets
          </p>
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 mx-auto"
          >
            <Wallet className="w-5 h-5" />
            <span>Connect Wallet</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Tickets
          </h1>
          <p className="text-gray-600">
            Manage your NFT tickets and collectible badges
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Tickets Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Purchase your first NFT ticket to get started!
            </p>
            <button
              // onClick={() => setCurrentView('events')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div 
                key={ticket.tokenId}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ticket.eventTitle}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(ticket.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{ticket.eventLocation}</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-gray-50 p-4 rounded-xl mb-4">
                    <div className="text-center mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Entry QR Code
                      </h4>
                      <p className="text-xs text-gray-600">
                        Show this at the venue
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-white p-3 rounded-lg">
                        <QRCode
                          value={generateQRData(ticket)}
                          size={120}
                          bgColor="transparent"
                          fgColor="#1f2937"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Token ID: {ticket.tokenId.slice(0, 8)}...
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

// Main App Component
function App() {
  console.log('App component rendering...');
  const [currentView, setCurrentView] = useState('landing');
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false
  });

  // Wallet Connection Functions
  const connectWallet = async () => {
    setWalletState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      // Simulate Coinbase Wallet connection
      // In a real implementation, you would use @coinbase/wallet-sdk
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock wallet address - replace with actual wallet integration
      const mockAddress = '0x742d35Cc6C842835D59f61e8A000B60C9b8F1234';
      
      setWalletState({
        isConnected: true,
        address: mockAddress,
        isConnecting: false
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      isConnecting: false
    });
    setCurrentView('landing');
  };

  const purchaseTicket = async (eventId: string) => {
    if (!walletState.address) return;

    try {
      const response = await axios.post('/api/tickets/mint', {
        eventId,
        ownerAddress: walletState.address
      });
      
      // Show success message or redirect
      console.log('Ticket purchased successfully:', response.data);
      
      // Switch to dashboard to show new ticket
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      throw error;
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'events':
        return (
          <Events
            walletState={walletState}
            connectWallet={connectWallet}
            purchaseTicket={purchaseTicket}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            walletState={walletState}
            connectWallet={connectWallet}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return <Landing setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        walletState={walletState}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;