const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String, trim: true },
  },
  {
    timeStamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports =  Message;
