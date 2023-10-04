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
module.exports = router