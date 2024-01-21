const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../Utils/generateToken");
const bcrypt = require("bcryptjs");

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email or Password missing");
  }

  const existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    throw new Error("You need to signup first to create your account");
  }

  if (!bcrypt.compareSync(password, existingUser.password)) {
    throw new Error("Incorrect password");
  }

  res.status(200).json({
    _id: existingUser._id,
    name: existingUser.name,
    picture: existingUser.profilePicture,
    email: existingUser.email,
    token: generateToken(existingUser.id),
  });
});

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(400);
    throw new Error("Account already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    profilePicture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      picture: user.profilePicture,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("error creating User");
  }
});

const searchUser = asyncHandler(async (req, res) => {
  const user = req.query.search;

  const searchParam = user
    ? {
        $or: [
          { name: { $regex: user, $options: "i" } },
          { email: { $regex: user, $options: "i" } },
        ],
      }
    : {};

  const userList = await User.find(searchParam).find({
    _id: { $ne: req.user._id },
  });

  res.status(200).send(userList);
});

module.exports = { signIn, signUp, searchUser };
