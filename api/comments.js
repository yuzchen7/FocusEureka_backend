const router = require('express').Router();
const { Comment } = require("../db/models");

router.get("/", async (req,res,next) => {
    try{
        const allComments = await Comment.findAll({where:{reply_comment_id:null}});
        allComments
        ?res.status(200).json(allComments)
        :res.status(404).json("Comments not found");
    }catch(error){
        next(error);
    }
})

router.post("/write", async (req, res,next) => {
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

module.exports = router