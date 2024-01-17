const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");

const isAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    
    try {
      token = req.headers.authorization.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JSON_SECRET);

      req.user = await User.findOne({_id: verifiedToken.id}).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("not authorized");
    }
  } else {
    res.status(401);
    throw new Error("You have to login first to access this page");
  }
});

module.exports = isAuth;
