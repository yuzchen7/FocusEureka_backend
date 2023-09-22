const router = require('express').Router();
const { post } = require("../db/models");

router.get("/", async (req, res, next) => {
    console.log("get all posts triggered");
    try {
      const allposts = await post.findAll({ order: [['id', 'ASC']] });
  
      allposts
        ? res.status(200).json(allposts)
        : res.status(404).send("Posts Not Found");
    } catch (error) {
      next(error);
    }
});

module.exports = router;