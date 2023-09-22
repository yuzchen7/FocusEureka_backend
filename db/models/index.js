const User = require("./user");
const friend_list = require("./FriendList");
const friend_request = require("./FriendRequest");
const group = require("./Group");
const group_member = require("./GroupMember");
const group_request = require("./GroupRequest");
const like_action = require("./LikeAction");
const post = require("./Post");
const ImageSet = require("./ImageSet");
const PostLike = require("./PostLike");

/* 
   some relationship are state in the db models js file, which is Enforcing a foreign key 
   reference without constraints.
   documentation @see: 
      https://sequelize.org/docs/v6/other-topics/constraints-and-circularities/#enforcing-a-foreign-key-reference-without-constraints
*/

User.belongsToMany(User, {
   as: 'Friends',
   through: friend_list,
   foreignKey: 'ownerid',
   otherKey: 'friendid',
});

ImageSet.belongsTo(post);

module.exports = {
   User, friend_list, friend_request,
   group, group_member, group_request,
   like_action, post, ImageSet, PostLike
};