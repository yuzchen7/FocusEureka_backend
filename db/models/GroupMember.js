const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("./user");
const group = require("./Group");

const group_member = db.define("group_member", {
   // id : {
   //    type : DataTypes.INTEGER,
   //    allowNull : false,
   //    unique : true,
   //    primaryKey : true,
   //    autoIncrement : true,
   //    validate : {
   //       isInt : true,
   //       notEmpty : true
   //    }
   // },

   member_id : {
      type : DataTypes.INTEGER,
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

   group_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      allowNull : false,
      validate : {
         isInt : true,
         notEmpty : true
      },
      references : {
         model : group,
         key : "id"
      }
   }

}, {
   timestamps : false,
});

module.exports = group_member;