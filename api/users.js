const router = require('express').Router();
const { User, friend_list } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    const allUser = await User.findAll({ order: [['id', 'ASC']] });

    allUser
      ? res.status(200).json(allUser)
      : res.status(400).send("User List Not Found");
  } catch (error) {
    next(error);
  }
});

router.get("/findUser", async (req, res, next) => {
  try {
    const username = req.query.username;
    console.log(username);
    const foundUser = await User.findOne({ where: { username: username } });
    foundUser
      ? res.status(200).json(foundUser)
      : res.status(404).send("User Not Found");
  } catch (error) {
    next(error);
  }
});

router.put("/updateInfo", async (req, res, next) => {
  try {
    const username = req.body.username;
    const foundUser = await User.findOne({ where: { username: username } });
    if (foundUser) {
      await foundUser.update(req.body);
      (res.status(200).json(foundUser))
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteAccount", async (req, res, next) => {
  try {
    const username = req.query.username;
    const deleteUser = await User.findOne({ where: { username: username } });
    const friend_list_data = await friend_list.findAll({ where: {ownerid:deleteUser.id} });

    if (friend_list_data) {
      await friend_list_data[0].destroy();
      res.status(200).send(friend_list_data);
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    next(error);
  }
})

router.get("/friendList", async (req, res, next) => {
  try {
    const username = req.query.username;
    const friendList = await User.findOne({
      attributes: ['id','first_name','last_name','middle_name','username',],
      include: [
        {
          model: User,
          as: 'Friends',
          through: friend_list,
          foreignKey: 'onwerid',
          otherKey: 'friendid',
          attributes: ['id','first_name','last_name','middle_name','username'],
        },
      ],
      where:{username:username}
    })
    friendList ?
      res.status(200).json(friendList)
      : res.status(404).send("Friend List Not Found");
  } catch (error) {
    next(error);
  }
})
module.exports = router;