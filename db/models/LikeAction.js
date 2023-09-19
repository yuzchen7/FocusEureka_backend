const { DataTypes } = require("sequelize");
const db = require("../db");

const like_action = db.define("like_action", {
   action_id : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },

   action_value : {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
         notEmpty : true
      }
   }

}, {
   timestamps : false,
});

module.exports = like_action;