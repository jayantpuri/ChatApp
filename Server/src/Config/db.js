const mongoose = require("mongoose");

const mongoConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conneceted ${conn.connection.host}`);
  } catch (error) {
    console.log("error conecting to database");
    process.exit();
  }
};

module.exports = mongoConnection;
