const db = require("./db");

const {
  User, friend_list, friend_request,
  group, group_member, group_request,
  like_action, post
} = require("./db/models");

const {
  UserSeed, FriendListSeed, FriendRequestSeed,
  GroupSeed, GroupMemberSeed, GroupRequestSeed,
  LikeActionSeed, PostSeed
} = require("./data");

const seed = async () => {
  await User.bulkCreate(UserSeed);
  await friend_list.bulkCreate(FriendListSeed);
  await friend_request.bulkCreate(FriendRequestSeed);
  await group.bulkCreate(GroupSeed);
  await group_member.bulkCreate(GroupMemberSeed);
  await group_request.bulkCreate(GroupRequestSeed);
  await like_action.bulkCreate(LikeActionSeed);
  await post.bulkCreate(PostSeed);
};

seed().then(() => process.exit());