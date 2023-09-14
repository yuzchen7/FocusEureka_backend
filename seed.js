const db = require("./db");
const { User} = require("./db/models");

const UserSeed = [
  {
    first_name: "Yuzhuang",
    last_name: "Chen",
    username: "Yuzhuang7789@gmail.com",
    password: "1234567",
  },
  {
    first_name: "Adien",
    last_name: "Logan",
    username: "AdienLogan@gmail.com",
    password: "817381042",
  },
  {
    first_name: "Russell",
    last_name: "Becker",
    username: "RussellBecker9989@gmail.com",
    password: "oioppq1322",
  },
  {
    first_name: "Shuan",
    last_name: "Vance",
    username: "Vance_Shuan7789@gmail.com",
    password: " ",
  },
  {
    first_name: "Jenna",
    last_name: "Livingston",
    username: "Jenna9223@gmail.com",
    password: "iuiweoqc",
  },
];

const seed = async () => {
  await User.bulkCreate(UserSeed);
};

seed().then(() => process.exit());