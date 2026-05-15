require('dotenv').config()

const http = require("http");

const app = require('./src/app')

const connectToDB = require('./src/db/db')
const { initSocket } = require("./src/socket/socket");

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

initSocket(server);
connectToDB()
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});