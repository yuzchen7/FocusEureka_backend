const { DataTypes } = require('sequelize');
const db = require("../db");

const User = require("./user");

const group = db.define("group", {
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

   name : {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue : "unnamed",
      validate: {
         notEmpty: true
      }
   },

   meet_date : {
      type: DataTypes.STRING
   },

   meet_time : {
      type: DataTypes.STRING
   },

   address : {
      type: DataTypes.STRING
   },

   city : {
      type: DataTypes.STRING
   },

   state : {
      type: DataTypes.STRING
   },

   zipcode : {
      type: DataTypes.STRING
   }

}, {
   timestamps : false,
});

module.exports = group;