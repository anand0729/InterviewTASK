const express = require("express");
const cluster = require("cluster");
const os = require("os");
const noOfCPUs = os.cpus().length;
const app = express();
const server = require("http").createServer(app);
const router = express.Router();
require("dotenv").config();
const debug = require("debug")("debug");
const db = require("./config/database");
require("./models");

  const { sequelize } = require("./config/database");
  require("./middleware")(app);
  const userRoutes = require("./routes")(router, {});
  app.use("/api", userRoutes);
  if (cluster.isMaster) {
    for (let i = 0; i < noOfCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      console.log(`${worker.process.pid} Killed`);
      cluster.fork();
    });
  } else {
    const { sequelize } = require("./config/database");
   
      sequelize
      .authenticate()
      .then(() => {
        db.sequelize
          .sync((force) => true)
          .then(function () {
            console.error("Database Connected");
          });
      })
      .catch((err) => console.error("DATABASE ERROR"));
   
    
    let port = process.env.ServerPort || 3000;
    server.listen(port, () => {
      console.log(
        `Node Started @ PORT No ${port} CPU CORE's Available ${noOfCPUs} PID ${process.pid}`
      );
    });
  }

