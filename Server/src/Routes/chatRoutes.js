const express = require("express");
const isAuth = require("../Middlewares/authMiddleware");
const {
  createSingleChat,
  getAllChats,
  createGroupChat,
  renameGroup,
  addUser,
} = require("../Controllers/chatController");
const chatRouter = express.Router();

chatRouter.get("/getAllChats", isAuth, getAllChats);
chatRouter.put("/renameGroup", isAuth, renameGroup);
chatRouter.post("/createGroupChat", isAuth, createGroupChat);
chatRouter.post("/createSingleChat", isAuth, createSingleChat);
chatRouter.post("/addUser", isAuth, addUser);

module.exports = chatRouter;
