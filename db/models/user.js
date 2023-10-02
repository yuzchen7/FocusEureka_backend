const crypto = require("crypto");
const { Model, DataTypes } = require("sequelize");
const db = require("../db");

class User extends Model {
   static async generateSalt() {
      return crypto.randomBytes(16).toString("base64");
   }

   static async encryptPassword(password, salt) {
      return crypto
         .createHash("RSA-SHA256")
         .update(password)
         .update(salt)
         .digest("hex");
   }

   async validatePassword(targetPassword) {
      return (
         (await User.encryptPassword(targetPassword, this.salt)) === this.password
      );
   }
}

User.init(
   {
      first_name: {
         type: DataTypes.STRING,
         allowNull: true,
      },

      last_name: {
         type: DataTypes.STRING,
         allowNull: true
      },

      middle_name: {
         type: DataTypes.STRING,
         allowNull: true
      },

      username: {
         type: DataTypes.STRING,
         unique: true,
         require: true
      },

      password: {
         type: DataTypes.STRING,
      },

      salt: {
         type: DataTypes.STRING,
      }
   },
   {
      timestamps: false,
      sequelize: db,
      modelName: "user",
      hooks: {
         beforeSave: async(user) => {
            if (user.changed("password")) {
               user.salt = await User.generateSalt();
               user.password = await User.encryptPassword(
                  user.password,
                  user.salt
               );
            }
         },
         beforeBulkCreate: async(users) => {
            for (let user of users) {
               if (user.changed("password")) {
                  user.salt = await User.generateSalt();
                  user.password = await User.encryptPassword(
                     user.password,
                     user.salt
                  );
               }
            }
         }
      }
   }
);

module.exports = User;