import React, { useState } from 'react';
import axios from 'axios';
import { QrCode, CheckCircle, XCircle, RefreshCw, Smartphone, AlertCircle, Upload, FileText } from 'lucide-react';

interface ScannerProps {
  walletState: {
    isConnected: boolean;
    address: string | null;
  };
  onTicketCheckedIn?: () => void; // Callback to notify parent of successful check-in
}

interface ScannedTicketData {
  tokenId: string;
  eventId: string;
  eventName: string;
  ownerAddress: string;
  nftTransactionHash?: string;
  nftMintSuccess?: boolean;
  nftBlockNumber?: number;
  status: string;
  purchaseDate: string;
  timestamp: string;
}

const Scanner: React.FC<ScannerProps> = ({ walletState, onTicketCheckedIn }) => {
  const [scannedData, setScannedData] = useState<ScannedTicketData | null>(null);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
    ticketData?: any;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const handleScannedData = (data: any) => {
    // Validate the scanned data structure
    if (!data.tokenId || !data.eventId || !data.eventName || !data.ownerAddress) {
      setError('Invalid ticket data. Please scan a valid ticket QR code.');
      return;
    }

    const ticketData: ScannedTicketData = {
      tokenId: data.tokenId,
      eventId: data.eventId,
      eventName: data.eventName,
      ownerAddress: data.ownerAddress,
      nftTransactionHash: data.nftTransactionHash,
      nftMintSuccess: data.nftMintSuccess || false,
      nftBlockNumber: data.nftBlockNumber,
      status: data.status || 'toBeAttended',
      purchaseDate: data.purchaseDate || new Date().toISOString(),
      timestamp: new Date().toISOString()
    };

    setScannedData(ticketData);
    setError(null);
  };

  const enableTestMode = () => {
    setIsTestMode(true);
    setError(null);
    // Simulate a successful scan immediately
    simulateQRCodeDetection();
  };

  const simulateQRCodeDetection = () => {
    const sampleQRData = {
      tokenId: "local_1756596630963_owq8f6mig",
      eventId: "1",
      eventName: "MAD(wo)MEN Launch Party",
      ownerAddress: "0x742d35Cc6C842835D59f61e8A000B60C9b8F1234",
      nftTransactionHash: "local_1756596630963",
      nftMintSuccess: false,
      nftBlockNumber: undefined,
      status: "toBeAttended",
      purchaseDate: "2025-01-15T00:00:00.000Z",
      timestamp: new Date().toISOString()
    };

    handleScannedData(sampleQRData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, we'll simulate processing the file
    // In a real implementation, you'd use a QR code library to decode the image
    console.log('File uploaded:', file.name);
    
    // Simulate successful QR code detection
    simulateQRCodeDetection();
    
    // Clear the file input
    event.target.value = '';
  };

  const handleManualInput = () => {
    if (!manualInput.trim()) {
      setError('Please enter ticket data');
      return;
    }

    try {
      const parsedData = JSON.parse(manualInput);
      handleScannedData(parsedData);
      setManualInput('');
    } catch (parseError) {
      setError('Invalid JSON format. Please enter valid ticket data.');
    }
  };

  const validateTicket = async () => {
    if (!scannedData) return;

    try {
      setIsValidating(true);
      setError(null);

      const response = await axios.post('/api/tickets/check-in', {
        userWalletAddress: scannedData.ownerAddress,
        eventId: scannedData.eventId
      });

      if (response.data.success) {
        setValidationResult({
          success: true,
          message: response.data.message,
          ticketData: response.data
        });
        
        // Update the scanned data status
        setScannedData(prev => prev ? { ...prev, status: 'Attended' } : null);
        
        // Notify parent component that ticket was checked in
        if (onTicketCheckedIn) {
          console.log('🎉 Calling onTicketCheckedIn callback');
          onTicketCheckedIn();
        } else {
          console.log('⚠️ onTicketCheckedIn callback not provided');
        }
      } else {
        setValidationResult({
          success: false,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error('Validation error:', error);
      setValidationResult({
        success: false,
        message: error.response?.data?.message || 'Failed to validate ticket'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setValidationResult(null);
    setError(null);
    setIsTestMode(false);
    setManualInput('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ticket Scanner</h1>
          <p className="text-xl text-gray-600">Scan QR codes to validate and check-in attendees</p>
        </div>

        {/* Scanner Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h2>
            <p className="text-gray-600">Upload QR code images or enter ticket data manually</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Test Mode Indicator */}
          {isTestMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-600 font-medium">Test Mode Enabled</p>
                  <p className="text-blue-600 text-sm">Simulating QR code scan for testing purposes.</p>
                </div>
              </div>
            </div>
          )}

          {!scannedData && !isTestMode && (
            <div className="space-y-6">
              {/* File Upload */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload QR Code Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="qr-file-input"
                  />
                  <label
                    htmlFor="qr-file-input"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-12 h-12 text-gray-400" />
                    <span className="text-gray-600">Click to upload QR code image</span>
                    <span className="text-sm text-gray-500">Supports: JPG, PNG, GIF</span>
                  </label>
                </div>
              </div>

              {/* Manual Input */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Or Enter Ticket Data Manually</h3>
                <div className="max-w-md mx-auto space-y-3">
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Paste ticket JSON data here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <button
                    onClick={handleManualInput}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Process Data</span>
                  </button>
                </div>
              </div>

              {/* Test Mode Button */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Or test the scanner immediately:</p>
                <button
                  onClick={enableTestMode}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Enable Test Mode</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scanned Data Display */}
        {scannedData && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Scanned Ticket</h2>
              <button
                onClick={resetScanner}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Ticket Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Event Name:</span>
                      <p className="font-medium">{scannedData.eventName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Event ID:</span>
                      <p className="font-mono text-sm">{scannedData.eventId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Purchase Date:</span>
                      <p className="text-sm">{new Date(scannedData.purchaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">NFT Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Token ID:</span>
                      <p className="font-mono text-sm break-all">{scannedData.tokenId}</p>
                    </div>
                    {scannedData.nftTransactionHash && (
                      <div>
                        <span className="text-sm text-gray-500">Transaction Hash:</span>
                        <p className="font-mono text-xs break-all">{scannedData.nftTransactionHash}</p>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Blockchain Status:</span>
                      {scannedData.nftMintSuccess ? (
                        <span className="text-green-600 text-sm">✅ Minted on Blockchain</span>
                      ) : (
                        <span className="text-yellow-600 text-sm">⚠️ Local Storage</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendee Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendee Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Wallet Address:</span>
                      <p className="font-mono text-sm break-all">{scannedData.ownerAddress}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Current Status:</span>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scannedData.status)}`}>
                        {getStatusText(scannedData.status)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Scan Time:</span>
                      <p className="text-sm">{new Date(scannedData.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Validation Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions</h3>
                  <div className="space-y-3">
                    {scannedData.status === 'toBeAttended' ? (
                      <button
                        onClick={validateTicket}
                        disabled={isValidating}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isValidating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Validating...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Check-in Attendee</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-600 font-medium">Already Checked In</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Result */}
        {validationResult && (
          <div className={`rounded-2xl shadow-lg p-8 ${
            validationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              {validationResult.success ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <h3 className={`text-xl font-bold ${
                validationResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {validationResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
              </h3>
            </div>
            <p className={`text-lg ${
              validationResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {validationResult.message}
            </p>
            {validationResult.success && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-700 font-medium text-lg mb-2">Ticket Status Updated!</p>
                  <p className="text-green-600 text-sm">The ticket status has been changed from "To Be Attended" to "Attended".</p>
                  <p className="text-green-600 text-sm mt-2">You can now view the updated status in the My Tickets section.</p>
                </div>
              </div>
            )}
            {validationResult.success && validationResult.ticketData && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Attendee:</strong> {validationResult.ticketData.userName || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {validationResult.ticketData.eventStatus}
                </p>
                {validationResult.ticketData.tokenId && (
                  <p className="text-sm text-gray-600">
                    <strong>Token ID:</strong> {validationResult.ticketData.tokenId}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner; 