import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Html5Qrcode } from "html5-qrcode";

const QRCodeHandler = () => {
    const [qrValue, setQrValue] = useState('');
    const [scannedResult, setScannedResult] = useState('');
    const html5QrCodeRef = useRef(null);

    // Function to handle QR code generation
    const handleInputChange = (e) => {
        setQrValue(e.target.value);
    };

    // Initialize the scanner only once
    useEffect(() => {
        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new Html5Qrcode("qr-reader", true);
        }
    }, []);

    // Function to handle QR code scanning from an image
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setScannedResult("No file selected.");
            return;
        }

        const scanner = html5QrCodeRef.current;
        if (scanner) {
            scanner.scanFile(file, true)
                .then((decodedText) => {
                    setScannedResult(decodedText);
                    // Reset the file input to allow scanning the same file again if needed
                    e.target.value = null;
                })
                .catch((err) => {
                    console.error("Error scanning QR code:", err);
                    setScannedResult("Could not scan QR code. Please ensure the image contains a clear QR code.");
                    e.target.value = null;
                });
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* QR Code Generator Section */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h2>Create a QR Code</h2>
                <input
                    type="text"
                    value={qrValue}
                    onChange={handleInputChange}
                    placeholder="Enter data to encode..."
                    style={{
                        padding: '10px',
                        width: '80%',
                        maxWidth: '400px',
                        marginBottom: '20px',
                        fontSize: '16px'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {qrValue && (
                        <div style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
                            <QRCode value={qrValue} />
                        </div>
                    )}
                </div>
            </div>

            {/* QR Code Scanner Section */}
            <div style={{ textAlign: 'center' }}>
                <h2>Scan a QR Code from an Image</h2>
                <p>Upload an image to scan the QR code.</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: '20px' }}
                />
                {scannedResult && (
                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                        <h3>Scanned Result:</h3>
                        <p style={{ fontWeight: 'bold' }}>{scannedResult}</p>
                    </div>
                )}
                <div id="qr-reader" style={{ width: '100%' }}></div>
            </div>
        </div>
    );
};

export default QRCodeHandler;