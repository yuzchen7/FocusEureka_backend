const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("./user");
const group = require("./Group");

const group_request = db.define("group_request", {
   onwer_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      primaryKey : true,
      autoIncrement : true,
      validate : {
         isInt : true,
         notEmpty : true
      }
   },

   request_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      primaryKey : true,
      validate : {
         isInt : true,
         notEmpty : true
      },
      references : {
         model : User,
         key : "id"
      }
   },

  group_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      primaryKey : true,
      validate : {
         isInt : true,
         notEmpty : true
      },
      references : {
         model : group,
         key : "id"
      }
   },

}, {
   timestamps : false
});

module.exports = group_request;