const db = require("./db");
const { User } = require("./db/models");
const { UserSeed } = require("./data");

const seed = async () => {
  await User.bulkCreate(UserSeed);
};

seed().then(() => process.exit());