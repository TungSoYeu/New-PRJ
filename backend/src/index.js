require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const apiRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Logger
app.use(morgan('combined'));

// API Routes
app.use('/api', apiRoutes);

// Serves the frontend statically
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Bất kỳ route nào không phải là /api thì trả về trang SPA
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Backend API Server running on http://localhost:${port}`);
});
