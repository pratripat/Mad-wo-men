# Mad-wo-men - Event QR Code Check-In Prototype

A complete React application demonstrating both sides of an event QR code check-in system - ticket generation and verification scanning.

## 🎯 **Features**

### **User-side QR Generation (`TicketQR` component)**
- 📝 **Dynamic Form Inputs**: Customize token ID, user name, event name, and seat number
- 🎫 **QR Code Generation**: Uses `qrcode.react` library to create QR codes
- 📋 **JSON Data Encoding**: QR codes contain structured JSON with all ticket information
- 🎨 **Real-time Updates**: QR code updates instantly as you modify form fields
- 📱 **Mobile-Friendly**: Responsive design works on all device sizes

### **Organizer-side QR Scanning (`CheckInScanner` component)**
- 📱 **Camera Access**: Uses `react-qr-scanner` for live camera scanning
- 🔍 **Token Lookup**: Scans QR codes and looks up data in the provided token database
- ✅ **Data Validation**: Shows user information when tokens are found
- ❌ **Error Handling**: Gracefully handles invalid tokens and camera issues
- 🔄 **Reset Functionality**: Easy reset to scan multiple tickets

## 🏗️ **Project Structure**

```
src/
├── components/
│   ├── TicketQR.js          # QR code generation component
│   ├── TicketQR.css         # TicketQR styling
│   ├── CheckInScanner.js    # QR scanning component
│   └── CheckInScanner.css   # CheckInScanner styling
├── App.js                   # Main app with side-by-side layout
├── App.css                  # Main app styling
├── index.js                 # App entry point
└── index.css                # Global styles
```

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with camera access

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📱 **How to Use**

### **1. Generate Tickets (Left Side)**
- Fill in the form fields with ticket information
- Watch the QR code update in real-time
- The QR code contains all the data in JSON format

### **2. Scan Tickets (Right Side)**
- Allow camera permissions when prompted
- Point camera at a generated QR code
- View the scanned data and token lookup results

### **3. Sample Data**
The app includes sample token data for testing:
- **TICKET001**: John Doe (Confirmed)
- **TICKET002**: Jane Smith (Confirmed)  
- **TICKET003**: Bob Johnson (Pending)

## 🛠️ **Technical Details**

- **Framework**: React 18 with functional components and hooks
- **QR Generation**: `qrcode.react` - lightweight, no external dependencies
- **QR Scanning**: `react-qr-scanner` - camera access and QR detection
- **Styling**: Pure CSS with modern gradients and responsive design
- **Data Format**: JSON-encoded QR codes with timestamp validation

## 🎨 **Design Features**

- **Side-by-side Layout**: Easy comparison between generation and scanning
- **Modern UI**: Gradient backgrounds, smooth animations, clean typography
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Error States**: Clear visual feedback for all error conditions
- **Success States**: Celebratory design for successful operations

## 🔧 **Customization**

- **Token Data**: Modify the `tokenDataMap` in `App.js` for your events
- **QR Content**: Adjust the JSON structure in `TicketQR.js`
- **Styling**: Update CSS variables for custom branding
- **Scanner Settings**: Modify camera constraints in `CheckInScanner.js`

## 🚨 **Error Handling**

- **Camera Permissions**: Clear guidance for camera access issues
- **Invalid QR Codes**: Graceful handling of malformed data
- **Network Issues**: Offline-capable QR generation
- **Browser Compatibility**: Fallbacks for unsupported features

## 📱 **Mobile Considerations**

- **Camera Access**: Optimized for mobile device cameras
- **Touch Interface**: Large, touch-friendly buttons and inputs
- **Responsive Layout**: Automatically adapts to screen size
- **Performance**: Optimized for mobile device performance

## 🔮 **Future Enhancements**

- **Database Integration**: Connect to real event management systems
- **User Authentication**: Secure access for organizers
- **Analytics Dashboard**: Track check-ins and attendance
- **Offline Support**: PWA capabilities for poor network conditions
- **Multi-language**: International event support

## 📄 **License**

Built for hackathon demonstration - feel free to modify and extend for your events!

---

**Built with ❤️ for hackathon success!**
