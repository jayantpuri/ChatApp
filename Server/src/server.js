const app = require("./expressServer");
const http = require("http");
const dotenv = require("dotenv");
const mongoConnection = require("../src/Config/db");

dotenv.config();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

function startServer() {
  mongoConnection();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startServer();
