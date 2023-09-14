const db = require("./db");
const { User, friend_list, friend_request } = require("./db/models");
const { UserSeed, FriendListSeed, FriendRequestSeed } = require("./data");

const seed = async () => {
  await User.bulkCreate(UserSeed);
  await friend_list.bulkCreate(FriendListSeed);
  await friend_request.bulkCreate(FriendRequestSeed);
};

seed().then(() => process.exit());