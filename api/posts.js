const router = require('express').Router();
const { where } = require('sequelize');
const { post, User, ImageSet, Comment, PostLike } = require("../db/models");

const user_arrtibutes_filter = ['id', 'first_name', 'last_name', 'middle_name', 'username'];
//retrieve all posts stored in the database
router.get("/", async (req, res, next) => {
  console.log("get all posts triggered");
  try {
    const allposts = await post.findAll({
      include: [{ model: ImageSet },
      { model: User, as: 'owner', attributes: user_arrtibutes_filter },
      { model: PostLike, include: [{ model: User, attributes: user_arrtibutes_filter }] }],
      order: [['id', 'DESC']]
    });

    allposts
      ? res.status(200).json(allposts)
      : res.status(404).send("Posts Not Found");
  } catch (error) {
    next(error);
  }
});

router.get("/event", async (req, res, next) => {
  try {
    const lookForEvent = req.query.lookForEvent;
    const allposts = await post.findAll({
      include: [{ model: ImageSet },
      { model: User, as: 'owner', attributes: user_arrtibutes_filter },
      { model: PostLike, include: [{ model: User, attributes: user_arrtibutes_filter }] }],
      where: { event: lookForEvent },
      order: [['id', 'DESC']]
    });

    allposts
      ? res.status(200).json(allposts)
      : res.status(404).send("Posts Not Found");
  } catch (error) {
    next(error);
  }
});

router.get("/singleView", async (req, res, next) => {
  const postId = req.query.postId;
  try {
    const postInfo = await post.findOne({
      include: [
        { model: ImageSet },
        { model: User, as: 'owner', attributes: user_arrtibutes_filter },
        { model: PostLike, include: [{ model: User, attributes: user_arrtibutes_filter }] },
        {
          model: Comment,
          include: [
            { model: User, attributes: ['id','username'] },
            {
              model: Comment,
              as: 'reply_comment',
              include: [
                { model: User, attributes: ['id','username'] }
              ]
            }],
            required: false,
          // where:{reply_comment_id:{[Op.is]:null}}
          where: { reply_comment_id: null }
        }], where: { id: postId }
    });
    postInfo
      ? res.status(200).json(postInfo)
      : res.status(404).json("Post Not Found")
  } catch (error) {
    next(error)
  }
})

//retrieve all posts of current user
router.get("/user", async (req, res, next) => {
  console.log("get current user's posts triggered");
  try {

    const userId = req.query.userId;
    const currentUserPosts = await post.findAll({ include: ImageSet, where: { ownerid: userId } });

    currentUserPosts
      ? res.status(200).json(currentUserPosts)
      : res.status(404).send("Posts Not Found");
  } catch (error) {
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
  try {
    const postData = req.body;
    const newPost = await post.create(postData);
    await ImageSet.create({ post_id: newPost.id, urls: postData.urls })
    newPost
      ? res.status(200).json(postData)
      : res.status(404).send("New Posts Not Found");
  } catch (error) {
    next(error);
  }
})

router.put("/updateInfo", async (req, res, next) => {
  try {
    const updateInfo = req.body;
    const foundPost = await post.findByPk(updateInfo.id);
    const foundImageSet = await ImageSet.findByPk(foundPost.id)
    if (foundPost) {
      await foundImageSet.update({ urls: updateInfo.urls })
      await foundPost.update(updateInfo);
      res.status(200).json(foundPost);
    } else {
      res.status(404).send("Posts Not Found");
    }
  } catch (error) {
    next(error);
  }
});

//another endpoint for user to retrieve all of their posts
router.get("/currentUser", async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const posts = await User.findAll({
      include: [
        {
          model: post, include: [{ model: ImageSet },
          { model: PostLike, include: [{ model: User, attributes: user_arrtibutes_filter }] }]
        }
      ],
      where: { id: userId },
      order:[[post,'id','DESC']]
    })
    posts
      ? res.status(200).json(posts)
      : res.status(404).send("Posts Not Found");
  } catch (error) {
    next(error);
  }
});

//endpoint for user to add likes to their favorites posts
router.post("/Likes", async (req, res, next) => {
  try{
    const likesData = req.body;
    const LikesExisted = await PostLike.findOne({where: { user_id: likesData.user_id, post_id: likesData.post_id }});
    if(LikesExisted){
      const disLikes = await PostLike.destroy({where: { user_id: likesData.user_id, post_id: likesData.post_id }})
      res.status(200).json({message : disLikes})
    }else{
    const likes = await PostLike.create(likesData);
    likes
      ? res.status(200).json(likes)
      : res.status(404).send("your likes is gone~~~");
    }
  }catch (error) {
    next(error);
  }
})

module.exports = router;