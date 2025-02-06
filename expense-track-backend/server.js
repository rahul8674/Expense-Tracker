const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Or use: app.use(express.json());

// Connect to MongoDB
const mongoURI = 'mongodb+srv://rahulchhabra9000:Rahul321@cluster0.rj6bz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define a port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import routes
const expenseRoutes = require('./routes/expenses');

// Use the routes
app.use('/api/expenses', expenseRoutes);
