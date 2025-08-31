const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

const MONGODB_URI = 'mongodb://localhost:27017/madwomen-ticketing';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  process.exit(0);
})
.catch((error) => {
  console.log('❌ MongoDB connection error:', error.message);
  process.exit(1);
}); 