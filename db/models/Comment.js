const { DataTypes } = require('sequelize');
const db = require('../db');

const user = require("./user");
const post = require("./Post");

const Comment = db.define('comment', {
   id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      unique : true,
      allowNull : false,
      validate : {
         notEmpty : true
      }
   },

   onwer_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
         notEmpty : true
      },
      references : {
         model : user,
         key : 'id'
      }
   }, 

   post_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
         notEmpty : true
      },
      references : {
         model : post,
         key : 'id'
      }
   },

   contents : {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
         notEmpty : true
      }
   },
   
   replyied_to : {
      type : DataTypes.STRING,
      allowNull : true,
   },
});

module.exports = Comment;