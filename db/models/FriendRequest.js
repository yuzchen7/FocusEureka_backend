const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("./user");

const friend_request = db.define("friend_request", {
   ownerid : {
      type : DataTypes.INTEGER,
      unique : true,
      primaryKey : true,
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
      unique : true,
      primaryKey : true,
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