const router = require('express').Router();
const { post,User } = require("../db/models");

//retrieve all posts stored in the database
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

//retrieve all posts of current user
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

// {
//   "title":"TESTING POSTS",
//   "contents":"FOR TESTING only",
//   "address":"NoWhere",
//   "city":"nowhere",
//   "state":"state",
//   "zipcode":"11111",
//   "start_date":"2023-09-27",
//   "start_time":"21:37",
//   "end_date":"2023-09-30",
//   "end_time":"22:00",
//   "ownerid":"1",
//   "event":"true"
// }
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

router.put("/updatePost", async (req, res, next) => {
  try{
    const updateInfo = req.body;
    const foundPost = await post.findByPk(updateInfo.id);
    if(foundPost){
      await foundPost.update(updateInfo);
      res.status(200).json(foundPost);
    }else{
      res.status(404).send("Posts Not Found");
    }
  }catch(error){
    next(error);
  }
});

module.exports = router;