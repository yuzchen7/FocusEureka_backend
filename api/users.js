const router = require('express').Router();
const { User, friend_list } = require("../db/models");
const db = require("../db");

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

router.delete("/deleteUser", async (req, res, next) => {
  try {
    const username = req.query.username;
    const deleteUser = await User.findOne({ where: { username: username } });
    if (deleteUser) {
      await deleteUser.destroy();
      res.status(200).send(deleteUser);
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    next(error);
  }
})

router.get("/friendList", async (req, res, next) => {
  try {
    const onwer_id = req.query.onwerid;  
    // const friendList = await User.findOne({
    //   attributes: ['id','first_name','last_name','middle_name','username',],
    //   include: [
    //     {
    //       model: User,
    //       as: 'Friends',
    //       through: friend_list,
    //       foreignKey: 'onwerid',
    //       otherKey: 'friendid',
    //       attributes: ['id','first_name','last_name','middle_name','username'],
    //     },
    //   ],
    //   where:{id:onwer_id}
    // })
    const sql = `SELECT 
                    u.id,
                    u.first_name,
                    u.middle_name,
                    u.last_name,
                    u.username
                FROM 
                    users AS u
                WHERE 
                    u.id IN (
                      SELECT fl.friendid
                      FROM friend_lists AS fl
                      WHERE fl.ownerid = '${onwer_id}'
                    )
                or 
                    u.id IN (
                      SELECT fl.ownerid
                      FROM friend_lists AS fl
                      WHERE fl.friendid = '${onwer_id}'
                    )
                ;`;

    const [friendList, metadata] = await db.query(sql).catch(error => console.error(error));
    friendList ?
      res.status(200).json(friendList)
      : res.status(404).send("Friend List Not Found");
  } catch (error) {
    next(error);
  }
})
module.exports = router;