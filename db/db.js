const { Sequelize } = require('sequelize');
const pg = require('pg');
require("dotenv").config();

const db = new Sequelize(
   `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@localhost:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
   {
      logging: false,
   }
);

db.authenticate().then(() => {
   console.log("Connection has been established successfully.");
});

module.exports = db;