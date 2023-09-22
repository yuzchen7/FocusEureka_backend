const router = require('express').Router();
const { friend_request, User } = require("../db/models");

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

router.get("/currentUser", async (req, res, next) => {
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

module.exports = router;