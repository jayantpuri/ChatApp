const express = require("express");
const { signIn, signUp, searchUser } = require("../Controllers/userController");
const isAuth = require('../Middlewares/authMiddleware')
const userRouter = express.Router();

userRouter.post("/signIn", signIn);
userRouter.post("/signUp", signUp);
userRouter.get("/findUser", isAuth, searchUser);

module.exports = userRouter;
