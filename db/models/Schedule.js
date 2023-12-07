const { DataTypes } = require('sequelize');
const db = require('../db');

const User = require("./user");

const schedule = db.define("schedule", {
   user_id: {
      type : DataTypes.INTEGER,
      primaryKey : true,
      require : true,
      unique : true,
      validate : {
         notEmpty : true
      },
      references : {
         model : User,
         key : 'id'
      }
   },

   sun: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      },
   },

   mon: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      },
   },

   tue: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      },
   },

   wed: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      },
   },

   thu: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      },
   },

   fri: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      },
   },

   sat: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      },
   },

}, {
   timestamps : false
});

module.exports = schedule;