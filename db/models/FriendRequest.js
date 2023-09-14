const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("./user");

const friend_request = db.define("friend_request", {
   id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      unique : true,
      primaryKey : true,
      autoIncrement : true,
      validate : {
         isInt : true,
         notEmpty : true
      }
   },

   ownerid : {
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

   targetid : {
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
   }

}, {
   timestamps : false
});

module.exports = friend_request;