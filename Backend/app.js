const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const user=require("./Routes/userRoutes")
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables from config.env
dotenv.config({  });

const app = express();

// Middleware
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/user",user)

// Database connection
const DB = process.env.MONGO_URI; // Add your MongoDB URI in config.env
mongoose
  .connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Simple route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
