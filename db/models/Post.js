const { DataTypes } = require("sequelize");
const db = require("../db");

const User = require("./user");

const post = db.define("posts", {
   id : {
      type : DataTypes.INTEGER,
      unique : true,
      primaryKey : true,
      autoIncrement : true
   },

   title : {
      type : DataTypes.STRING,
      allowNull : false,
      require : true,
      validate : {
         notEmpty : true
      }
   },

   contents : {
      type : DataTypes.STRING,
      allowNull : true
   },

   address : {
      type : DataTypes.STRING
   },

   city : {
      type : DataTypes.STRING
   },

   state : {
      type : DataTypes.STRING
   },

   zipcode : {
      type : DataTypes.STRING
   },

   start_date : {
      type : DataTypes.STRING
   },

   start_time : {
      type : DataTypes.STRING
   },

   end_date : {
      type : DataTypes.STRING
   },

   end_time : {
      type : DataTypes.STRING
   },

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

   event : {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false
   }

});

module.exports = post;