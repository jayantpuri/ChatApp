const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const token = jwt.sign({id}, process.env.JSON_SECRET, {
    expiresIn: "5h",
  });
  return token;
};

module.exports = generateToken;
