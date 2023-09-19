const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("./user");

const friend_list = db.define("friend_list", {
   ownerid : {
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

   friendid : {
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
   }

}, {
   timestamps : false
});

module.exports = friend_list;