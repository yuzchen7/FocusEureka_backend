const { DataTypes } = require('sequelize');
const db = require('../db');

const Weekdays = db.define("weekdays", {
   date_id : {
      type : DataTypes.INTEGER,
      autoIncrement : true,
      unique : true,
      require : true,
      primaryKey : true,
      allowNull : false,
      validate : {
         notEmpty : true
      }
   },

   date_value : {
      type: DataTypes.STRING,
      require : true,
      allowNull : false,
      validate : {
         notEmpty : true
      }
   }

}, {
   timestamps : false
});

module.exports = Weekdays;