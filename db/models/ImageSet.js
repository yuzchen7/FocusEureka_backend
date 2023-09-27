const { DataTypes } = require('sequelize');
const db = require("../db");

const post = require("./Post");

const ImageSet = db.define("imaga_sets", {
   post_id : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references : {
         model : post,
         key : 'id'
      }
   },
   
   urls : {
      type : DataTypes.ARRAY(DataTypes.STRING),
   }

}, {
   timestamps: false
});

module.exports = ImageSet;