const db = require("./db");
const { User, friend_list } = require("./db/models");
const { UserSeed, FriendListSeed } = require("./data");

const seed = async () => {
  await User.bulkCreate(UserSeed);
  await friend_list.bulkCreate(FriendListSeed);
};

seed().then(() => process.exit());