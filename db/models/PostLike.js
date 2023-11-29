const { DataTypes } = require('sequelize');
const db = require('../db');

const user = require("./user");
const post = require("./Post");

const PostLike = db.define('post_like', {
   user_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      references : {
         model : user,
         key : 'id'
      }
   }, 

   post_id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      references : {
         model : post,
         key : 'id'
      }
   }

}, {
   timestamps : false
});

module.exports = PostLike;