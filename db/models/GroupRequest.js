const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("./user");
const group = require("./Group");

const group_request = db.define("group_request", {
   requestid : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false,
      validate : {
         isInt : true,
         notEmpty : true
      }
   },

   requester_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
         isInt : true,
         notEmpty : true
      },
      references : {
         model : User,
         key : "id"
      }
   },

   acceptor_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
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