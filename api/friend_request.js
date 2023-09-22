const router = require('express').Router();
const { friend_request, User } = require("../db/models");

//list all friend requests stored in the database
router.get("/", async (req, res, next) => {
    try {
        const all_friend_request = await User.findAll({ 
            include: [
                {
                  model: User,
                  as: 'Friends_requests',
                  through: friend_request,
                  foreignKey: 'onwerid',
                  otherKey: 'targetid',
                  attributes: ['id','first_name','last_name','middle_name','username'],
                },
              ],
              attributes: ['id','first_name','last_name','middle_name','username'],
              order: [['id', 'ASC']] });
        all_friend_request
            ? res.status(200).json(all_friend_request)
            : res.status(404).send("Friend Request Not Found");
    } catch (error) {
        next(error);
    }
});

//get all friend requests stored in the database that belong to current user
router.get("/sending", async (req, res, next) => {
    try{
        const username = req.query.username;
        const friend_request_data = await User.findAll({ 
            include: [
                {
                  model: User,
                  as: 'Friends_requests',
                  through: friend_request,
                  foreignKey: 'onwerid',
                  otherKey: 'targetid',
                  attributes: ['id','first_name','last_name','middle_name','username'],
                },
              ],
              attributes: ['id','first_name','last_name','middle_name','username'],
              order: [['id', 'ASC']],
              where:{username:username} 
        });
        friend_request_data?
            res.status(200).json(friend_request_data)
            :res.status(404).send("Current User's Friend Request Not Found");
    }catch(error){
        next(error);
    }
})

//create a new friend request and store it in the database
router.post("/createRequest", async (req, res, next) => {
    try{
        const currentUser = req.body.requester;
        const targetUser = req.body.receiver;
        const requester = await User.findOne({ where:{username:currentUser} });
        const receiver = await User.findOne({ where:{username:targetUser} });

        const reuqest = await friend_request.create({
            ownerid: requester.id,
            targetid: receiver.id
        });
        reuqest?
            res.status(200).json(reuqest)
            :res.status(404).send("Current User's Friend Request Not Found");
    }catch(error){
        next(error);
    }
})

module.exports = router;