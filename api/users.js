const router = require('express').Router();
const {User} = require("../db/models");

router.get("/", async (req, res, next) => {
    try {
      const allUser = await User.findAll();
  
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


module.exports = router;