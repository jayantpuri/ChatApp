const express = require("express");
const userRouter = require("./src/Routes/userRoutes");
const chatRouter = require("./src/Routes/chatRoutes");
const messageRouter = require("./src/Routes/messageRoutes");
const { notFound, errorHandler } = require("./src/Middlewares/errorMiddleware");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// ----------------Deployment-------------------------
// const dir = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   console.log('yes')
//   app.use(express.static(path.join(dir, "Client/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(dir, "Client", "build", "index.html"));
//   });
// } else {
//   console.log("nope");
// }

// ----------------Deployment-------------------------

app.use(notFound);
app.use(errorHandler);

module.exports = app;
