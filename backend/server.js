const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const game = require('./Models/Game');
const user = require('./Models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// MongoDB connection string (replace with your actual connection string)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/texasHoldemDB';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

const PORT = process.env.PORT || 8080;
console.log('Server port:', PORT);
const app = express();

// Middleware
// Enable CORS for all routes
app.use(cors());
app.use(express.json());
console.log("dirname:", __dirname);

// Serve React static files
const frontendPath = path.join(__dirname, '../frontend/build');

app.use(express.static(frontendPath));

// API route
app.get('/api/players', (req, res) => {
    const players = ['Alice', 'Bob', 'Charlie'];
    res.json(players);
});

// Catch-all route to serve React app
app.get('/', (req, res) => {

    res.json({ message: 'Welcome to the Texas Hold\'em API!' });
    // console.log('Catch-all route triggered');
    // const filePath = path.join(__dirname, '../frontend/build', 'index.html');
    // console.log('Serving file:', filePath);
    // res.sendFile(filePath);
});
// Add new player to database
app.post('/api/register', async (req, res) => {
    console.log('Request body:', req.body); // Debugging line

    try {
        // Hash the password
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create a new user with the hashed password
        const newUser = new user({
            ...req.body,
            password: hashedPassword, // Replace the plain text password with the hashed password
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'Player added successfully',
            user: savedUser,
        });
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({
            message: 'Failed to add player',
            error: error.message,
        });
    }
});
// Player authentication
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await user.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: foundUser._id }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                userId: foundUser._id,
                userName: foundUser.userName,
                email: foundUser.email,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


const server = http.createServer(app); // Wrap Express app with HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",
      },
  });

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle player actions
    socket.on('playerAction', (data) => {
        console.log('Player action:', data);
        // Broadcast the action to other players
        socket.emit('playerMoved', {
            player:socket.id,
            action:data.type,
            amount:data.amount,
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
});