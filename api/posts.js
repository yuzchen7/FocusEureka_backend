const router = require('express').Router();
const { post,User,ImageSet} = require("../db/models");

//retrieve all posts stored in the database
router.get("/", async (req, res, next) => {
    console.log("get all posts triggered");
    try {
      const allposts = await post.findAll({include: ImageSet});
  
      allposts
        ? res.status(200).json(allposts)
        : res.status(404).send("Posts Not Found");
    } catch (error) {
      next(error);
    }
});

router.get("/singleView", async (req, res, next) => {
  const postId = req.query.postId;
  try{
    const postInfo = await post.findOne({include: ImageSet, where: {id: postId}});
    postInfo
      ? res.status(200).json(postInfo)
      : res.status(404).json("Post Not Found")
  }catch (error) {
  }
})

//retrieve all posts of current user
router.get("/currentUser", async (req, res, next) => {
    console.log("get current user's posts triggered");
  try{

    const username = req.query.username;
    const user = await User.findOne({where :{username:username}});
    const currentUserPosts = await post.findAll({include: ImageSet,where :{ownerid:user.id}});

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
router.post("/create", async (req, res, next) => {
  try{
    const postData = req.body;
    const newPost = await post.create(postData);
    await ImageSet.create({post_id:newPost.id,urls:postData.urls})
    newPost
    ?res.status(200).json(postData)
    :res.status(404).send("New Posts Not Found");
  }catch(error){
    next(error);
  }
})

router.put("/updateInfo", async (req, res, next) => {
  try{
    const updateInfo = req.body;
    const foundPost = await post.findByPk(updateInfo.id);
    const foundImageSet = await ImageSet.findByPk(foundPost.id)
    if(foundPost){
      await foundImageSet.update({urls:updateInfo.urls})
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