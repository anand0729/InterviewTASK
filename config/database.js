const Sequelize = require('sequelize');
let host = process.env.devHost;
let database = process.env.devDB; 
let username = process.env.devDbUsername;
let password = process.env.devDbPassword;  

const db = {};
 
  const sequelize = new Sequelize(database, username, password, { 
    host: host,
    dialect: 'mysql',
    logging: false
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize; 

module.exports = db;
