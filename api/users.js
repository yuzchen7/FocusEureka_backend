const router = require('express').Router();
const {User} = require("../db/models");

router.get("/", async (req, res, next) => {
    try {
      const allUser = await User.findAll({order:[['id','ASC']]});
  
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
  try{
    const username = req.body.username;
    const foundUser = await User.findOne({ where: { username: username } });
    if(foundUser){
      await foundUser.update(req.body);
      (res.status(200).json(foundUser))
    }else{
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteUser", async (req, res, next) => {
  try{
    const username = req.query.username;
    const deleteUser = await User.findOne({ where: { username: username } });
    if(deleteUser){
      await deleteUser.destroy();
      res.status(200).send(deleteUser);
    }else{
      res.status(404).send("User Not Found");
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router;