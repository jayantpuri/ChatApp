const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const Message = require("../Models/messageModel");

const createSingleChat = asyncHandler(async (req, res) => {
  const { chatName, userId } = req.body;

  if (!chatName || !userId) {
    res.status(400);
    throw new Error("user or chatname missing");
  }

  const existingChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate({ path: "users", select: "-password" })
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "-password" },
    });

  if (existingChat) {
    res.send(existingChat);
  } else {
    newChat = await Chat.create({
      chatName,
      users: [req.user._id, userId],
      isGroupChat: false,
    });

    const fullChat = await Chat.findOne({ _id: newChat._id }).populate({
      path: "users",
      select: "-password",
    });
    res.status(200).send(fullChat);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, chatName } = req.body;

  if (!users || !chatName) {
    res.status(400);
    throw new Error("Please provide all the fields");
  }

  const usersList = JSON.parse(users);
  usersList.push(req.user);

  const newGroupChat = await Chat.create({
    users: usersList,
    groupAdmin: req.user._id,
    chatName,
    isGroupChat: true,
  });
  try {
    const fullGroupChat = await Chat.find({ _id: newGroupChat._id })
      .populate({ path: "users", select: "-password" })
      .populate({ path: "groupAdmin", select: "-password" });

    res.status(201).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error("Error creating chat");
  }
});

const getAllChats = asyncHandler(async (req, res) => {
  try {
    const allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate({ path: "users", select: "-password" })
      .populate({ path: "groupAdmin", select: "-password" })
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "-password" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).send(allChats);
  } catch (error) {
    res.status(400);
    throw new Error("cannot fetch chats");
  }
});

const addUser = asyncHandler(async (req, res) => {
  const { user, chatId } = req.body;
  const addNewUser = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: user } },
    {
      new: true,
    }
  );

  res.status(200).send(addNewUser);
});

const renameGroup = asyncHandler(async (req, res) => {
  const { groupName, chatId } = req.body;

  const updateName = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: groupName },
    {
      new: true,
    }
  );

  res.status(200).send(updateName);
});

module.exports = {
  createSingleChat,
  createGroupChat,
  getAllChats,
  addUser,
  renameGroup,
};
