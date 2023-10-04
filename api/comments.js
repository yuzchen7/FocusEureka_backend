const router = require('express').Router();
const { Comment } = require("../db/models");

router.get("/", async (req,res) => {
    try{
        const allComments = await Comment.findAll({where:{reply_comment_id:null}});
        allComments
        ?res.status(200).json(allComments)
        :res.status(404).json("Comments not found");
    }catch(error){
        next(error);
    }
})

router.post("/write", async (req, res) => {
    try{
        const commentData = req.body;
        const newComment = await Comment.create(commentData);
        newComment
        ?res.status(200).json(newComment)
        :res.status(404).json("new comment not found");
    }catch(error){
        next(error);
    }
})

router.post("/reply", async (req, res) => {
    try{
        const replyData = req.body;
        const reply_to_comment = await Comment.create(replyData);
        reply_to_comment
        ?res.status(200).json(reply_to_comment)
        :res.status(404).json("reply under comment is not found");
    }catch(error){
        next(error);
    }
})
module.exports = router