const app = require("./expressServer");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoConnection = require("./src/Config/db");

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

function startServer() {
  mongoConnection();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "https://swift-chat-theta.vercel.app",
    },
  });

  io.on("connection", (socket) => {
    socket.on("create user room", (user) => {
      socket.join(user._id);
      socket.emit("connected");
    });

    socket.on("join chat", (chat) => {
      socket.join(chat._id);
    });

    socket.on("new Message", (message) => {
      const chatUsers = message.chat.users;

      chatUsers.forEach((user) => {
        socket.in(user._id).emit("message Recieved", message);
      });
    });
  });
}

startServer();
