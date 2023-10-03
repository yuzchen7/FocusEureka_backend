const User = require("./user");
const friend_list = require("./FriendList");
const friend_request = require("./FriendRequest");
const group = require("./Group");
const group_member = require("./GroupMember");
const group_request = require("./GroupRequest");
const post = require("./Post");
const ImageSet = require("./ImageSet");
const PostLike = require("./PostLike");
const Comment = require("./Comment");
const Weekdays = require("./Weekdays");

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

User.belongsToMany(User, {
   as: 'Friends_requests',
   through: friend_request,
   foreignKey: 'ownerid',
   otherKey: 'targetid',
});

ImageSet.belongsTo(post,{ foreignKey: 'post_id' });
post.hasOne(ImageSet,{ foreignKey: 'post_id' });

Comment.hasMany(Comment, {
   as : "reply_comment",
   foreignKey: "reply_comment_id",
   allowNull: true,
});

post.belongsTo(User,{foreignKey:'ownerid'});
User.hasMany(post,{foreignKey:'ownerid'});

Comment.belongsTo(post,{ foreignKey: 'post_id' });
post.hasMany(Comment,{ foreignKey: 'post_id' });

post.hasMany(PostLike, { foreignKey: 'post_id'});
PostLike.belongsTo(post, { foreignKey : 'post_id' });

User.hasMany(PostLike, {foreignKey : 'user_id'});
PostLike.belongsTo(User, {foreignKey : 'user_id'});

module.exports = {
   User, friend_list, friend_request,
   group, group_member, group_request,
   post, ImageSet, PostLike, Comment, 
   Weekdays
};