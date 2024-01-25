const express = require("express");
const isAuth = require("../Middlewares/authMiddleware");
const { getAllMessages,sendMessage} = require("../Controllers/messageController");
const messageRouter = express.Router();

messageRouter.get("/getAllMessages/:chatId", isAuth, getAllMessages);
messageRouter.post("/sendMessage", isAuth, sendMessage);

module.exports = messageRouter;
