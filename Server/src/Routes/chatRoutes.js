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
chatRouter.put("/addUser", isAuth, addUser);
// TODO: Implement remove from group controller
chatRouter.put("/removeFromGroup", isAuth);
chatRouter.post("/createGroupChat", isAuth, createGroupChat);
chatRouter.post("/createSingleChat", isAuth, createSingleChat);

module.exports = chatRouter;
