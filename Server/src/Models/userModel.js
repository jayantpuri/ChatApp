const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, unique: true },
    password: { type: String, trim: true },
    profilePicture: {
      type: String,
      default: "https://icon-library.com/icon/android-user-icon-4.html",
    },
  },
  {
    timeStamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.modified) {
    next();
  }

  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});
const User = mongoose.model("User", userSchema);

module.exports = User;
