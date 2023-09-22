const { DataTypes } = require('sequelize');
const db = require('../db');

const user = require("./user");
const post = require("./Post");
const like_action = require("./LikeAction");

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
   },

   action_id : {
      type : DataTypes.INTEGER,
      references : {
         model : like_action,
         key : 'action_id'
      }
   },

}, {
   timestamps : false
});

module.exports = PostLike;