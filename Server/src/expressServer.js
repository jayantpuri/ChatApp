const express = require("express");
const userRouter = require("./Routes/userRoutes");
const chatRouter = require("./Routes/chatRoutes");
const messageRouter = require("./Routes/messageRoutes");
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
