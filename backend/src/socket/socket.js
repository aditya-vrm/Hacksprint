const { Server } = require("socket.io");

const Message = require("../models/message.model");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // JOIN USER ROOM
       socket.on("join", (userId) => {

   console.log("JOIN EVENT:", userId);

   socket.join(userId);

   console.log("ROOMS:", socket.rooms);

});

        // SEND MESSAGE
socket.on("send_message", async (data) => {

   try {

      const parsedData =
         typeof data === "string"
         ? JSON.parse(data)
         : data;

      console.log(parsedData);

      const {
         sender,
         receiver,
         text,
      } = parsedData;

      const message = await Message.create({
         sender,
         receiver,
         text,
      });

      io.to(receiver).emit("receive_message", message);

      io.to(sender).emit("receive_message", message);

   } catch (error) {

      console.log("Socket Error:", error);

   }

});

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}

module.exports = {
    initSocket,
};