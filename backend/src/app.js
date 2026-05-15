const express = require('express');
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json())
app.use(cookieParser())

// routes import
const authRouter = require('./routes/auth.routes');
const chatRouter = require("./routes/chat.routes");

// routes declaration
app.use('/api/v1/auth', authRouter);
app.use("/api/v1/chat", chatRouter);


module.exports = app