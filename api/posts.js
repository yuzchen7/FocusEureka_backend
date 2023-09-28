const router = require('express').Router();
const { post,User } = require("../db/models");

router.get("/", async (req, res, next) => {
    console.log("get all posts triggered");
    try {
      const allposts = await post.findAll();
  
      allposts
        ? res.status(200).json(allposts)
        : res.status(404).send("Posts Not Found");
    } catch (error) {
      next(error);
    }
});

router.get("/currentUser", async (req, res, next) => {
    console.log("get current user's posts triggered");
  try{

    const username = req.query.username;
    const user = await User.findOne({where :{username:username}});
    const currentUserPosts = await post.findAll({where :{ownerid:user.id}});

    currentUserPosts
    ? res.status(200).json(currentUserPosts)
    : res.status(404).send("Posts Not Found");
  }catch(error){
    next(error);
  }
})

router.post("/createPost", async (req, res, next) => {
  try{
    const postData = req.body;
    const newPost = await post.create(postData);
    newPost
    ?res.status(200).json(postData)
    :res.status(404).send("New Posts Not Found");
  }catch(error){
    next(error);
  }
})

module.exports = router;