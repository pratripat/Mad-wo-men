import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

interface Event {
  _id: string;
  eventName: string;
  eventType: string;
  location: string;
  date: string;
  price: number;
  maxSeats: number;
  bookedSeats: number;
}

interface EventsProps {
  walletState: {
    isConnected: boolean;
    address: string | null;
  };
  connectWallet: () => Promise<void>;
  purchaseTicket: (eventId: string) => Promise<any>;
}

const Events: React.FC<EventsProps> = ({ walletState, connectWallet, purchaseTicket }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to sample data if backend is unavailable
      setEvents([
        {
          _id: '1',
          eventName: 'MAD(wo)MEN Launch Party',
          eventType: 'tech',
          location: 'New York City, NY',
          date: '2025-01-15T00:00:00.000Z',
          price: 99.99,
          maxSeats: 500,
          bookedSeats: 127
        },
        {
          _id: '2',
          eventName: 'Blockchain & Web3 Summit',
          eventType: 'tech',
          location: 'San Francisco, CA',
          date: '2025-02-20T00:00:00.000Z',
          price: 149.99,
          maxSeats: 300,
          bookedSeats: 89
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (eventId: string) => {
    if (!walletState.isConnected) {
      await connectWallet();
      return;
    }

    try {
      setPurchasing(eventId);
      setError(null);
      
      const result = await purchaseTicket(eventId);
      
      // Show success message with NFT details
      if (result.nftMintSuccess) {
        alert(`🎉 Ticket purchased successfully!\n\nNFT Token ID: ${result.tokenId}\nTransaction Hash: ${result.transactionHash}\n\nYour NFT ticket has been minted on the blockchain!`);
      } else {
        alert(`🎫 Ticket purchased successfully!\n\nToken ID: ${result.tokenId}\n\nNote: NFT minting failed, but your ticket is saved locally.`);
      }
      
      // Update local state to reflect the new booking
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, bookedSeats: event.bookedSeats + 1 }
            : event
        )
      );
    } catch (error: any) {
      console.error('Purchase error:', error);
      setError(error.message || 'Failed to purchase ticket');
      alert(`❌ Purchase failed: ${error.message || 'Unknown error'}`);
    } finally {
      setPurchasing(null);
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'tech': return 'bg-blue-100 text-blue-800';
      case 'music': return 'bg-purple-100 text-purple-800';
      case 'art': return 'bg-pink-100 text-pink-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'workshop': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-xl text-gray-600">Discover and book NFT tickets for amazing events</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const isSoldOut = event.bookedSeats >= event.maxSeats;
            const isPurchasing = purchasing === event._id;
            const availableSeats = event.maxSeats - event.bookedSeats;
            
            return (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Event Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Ticket className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">{event.eventName}</p>
                  </div>
                </div>

                <div className="p-6">
                  {/* Event Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.eventType)}`}>
                      {event.eventType.toUpperCase()}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${event.price}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.eventName}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        {availableSeats} of {event.maxSeats} seats available
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Booked</span>
                      <span>{Math.round((event.bookedSeats / event.maxSeats) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.bookedSeats / event.maxSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(event._id)}
                    disabled={isSoldOut || isPurchasing}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      isSoldOut
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isPurchasing
                        ? 'bg-purple-400 text-white cursor-wait'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                    }`}
                  >
                    {isSoldOut ? (
                      'Sold Out'
                    ) : isPurchasing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Minting NFT...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Ticket className="w-4 h-4 mr-2" />
                        Purchase NFT Ticket
                      </div>
                    )}
                  </button>

                  {/* NFT Info */}
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">
                      🎫 This ticket will be minted as an NFT on the blockchain
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Events Available</h2>
            <p className="text-gray-600">Check back later for upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;