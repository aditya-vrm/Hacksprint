const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// routes import
const authRouter = require('./routes/auth.routes');
const chatRouter = require("./routes/chat.routes");
const projectRoutes = require("./routes/project.routes");
const blogRoutes = require("./routes/blog.routes");

// routes declaration
app.use('/api/v1/auth', authRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);

module.exports = app