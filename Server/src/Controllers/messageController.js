const expressAsyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const Chat = require("../Models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || !chatId) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  try {
    const newMessage = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content: message,
    });

    const updateLastMessage = await Chat.findOneAndUpdate(
      { _id: chatId },
      {
        lastMessage: newMessage._id,
      },
      {
        new: true,
      }
    );

    const fullMessage = await Message.findOne({ _id: newMessage._id })
      .populate({
        path: "chat",
        select: "users chatName isGroupChat",
        populate: { path: "users", select: "name profilePicture" },
      })
      .populate({ path: "sender", select: "name profilePicture" });

    res.status(201).send(fullMessage);
  } catch (error) {
    res.status(400);
    throw new Error("Error creating message");
  }
});

const getAllMessages = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const chatMessages = await Message.find({ chat: chatId })
      .populate({
        path: "sender",
        select: "name profilePicture",
      })
      .populate({
        path: "chat",

      });

    if (!chatMessages) {
      console.log("not message found")
      res.status(400);
      throw new Error("The chat does not exist");
    }

    res.status(200).send(chatMessages);
  } catch (error) {
    res.status(400);
    throw new Error("Error fetching meeages for this chat");
  }
});

module.exports = { sendMessage, getAllMessages };
