const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

// router
const userRouter = require('./routes/web/user.routes.js');
const adminRouter = require('./routes/admin/admin.routes.js')

// Load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cookieParser());
// Allow requests from your frontend (localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// DB connection
const dbconnect = require('./config/db.js')


// routes 
app.use("/user", userRouter);
app.use("/admin", adminRouter);


// Start the server
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
    dbconnect();
});

// Default route
app.get('/', (req, res) => {
    res.send("Default Route");
});