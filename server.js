const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// CORS: Allows the frontend (running on a different port) to communicate with this backend
app.use(cors());
// Body Parser: To parse JSON bodies from incoming requests
app.use(express.json());

// --- MongoDB Connection ---
// CORRECTED: The password has been inserted directly and the < > brackets are removed.
const dbURI = .env;

// CORRECTED: The deprecated options have been removed to clean up the warnings.
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema and Model ---
// This defines the structure of the documents that will be stored in the 'messages' collection.
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

// --- API Routes ---
// @route   POST api/contact
// @desc    Save a contact form message to the database
// @access  Public
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    const newMessage = new Message({
        name,
        email,
        message
    });

    // Save the new message to the database
    newMessage.save()
        .then(item => res.json({ msg: 'Message saved successfully!', item }))
        .catch(err => {
            console.error('Error saving message:', err);
            res.status(500).json({ msg: 'Server error while saving message.' });
        });
});

// --- Start the server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
