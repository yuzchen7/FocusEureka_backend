const db = require("./db");

const { 
  User, friend_list, friend_request,
  group, group_member, group_request,
} = require("./db/models");

const { 
  UserSeed, FriendListSeed, FriendRequestSeed,
  GroupSeed, GroupMemberSeed,
} = require("./data");

const seed = async () => {
  await User.bulkCreate(UserSeed);
  await friend_list.bulkCreate(FriendListSeed);
  await friend_request.bulkCreate(FriendRequestSeed);
  await group.bulkCreate(GroupSeed);
  await group_member.bulkCreate(GroupMemberSeed);
};

seed().then(() => process.exit());