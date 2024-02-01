const express = require("express");
const userRouter = require("./src/Routes/userRoutes");
const chatRouter = require("./src/Routes/chatRoutes");
const messageRouter = require("./src/Routes/messageRoutes");
const { notFound, errorHandler } = require("./src/Middlewares/errorMiddleware");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// ----------------Deployment-------------------------
const dir = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(dir, "/Client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dir, "Client", "build", "index.html"));
  });
} else {
  console.log("nope");
}
// ----------------Deployment-------------------------

app.use(notFound);
app.use(errorHandler);

module.exports = app;
