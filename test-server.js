console.log('Testing server startup...');

try {
  require('./backend/server.js');
  console.log('Server loaded successfully');
} catch (error) {
  console.error('Error loading server:', error);
} 