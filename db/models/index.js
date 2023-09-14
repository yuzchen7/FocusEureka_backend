const User = require("./user");
const friend_list = require("./FriendList");
const friend_request = require("./FriendRequest");

/* 
   the relationship between user and friend_list, friend_request 
   are state in the db models js file, which is Enforcing a foreign key 
   reference withoutconstraints.
   documentation @see: 
      https://sequelize.org/docs/v6/other-topics/constraints-and-circularities/#enforcing-a-foreign-key-reference-without-constraints
*/

// relationship between user and friend_list
// User.belongsToMany(User, { 
//    as: "onwer", 
//    through: {
//       model : friend_list
//    }, 
//    foreignKey: 'userid'
// });
// User.belongsToMany(User, { 
//    as: "friend", 
//    through: {
//       model : friend_list
//    }, 
//    foreignKey: 'friendid' 
// });

// relationship between user and friend_request
// User.belongsToMany(User, { 
//    as: "onwer", 
//    through: {
//       model : friend_request
//    }, 
//    foreignKey: 'userid'
// });
// User.belongsToMany(User, { 
//    as: "friend", 
//    through: {
//       model : friend_request
//    }, 
//    foreignKey: 'friendid' 
// });

module.exports = {
   User, friend_list, friend_request
};