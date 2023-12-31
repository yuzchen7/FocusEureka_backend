const router = require('express').Router();
const { friend_request, User, friend_list } = require("../db/models");
const db = require("../db")
const { Op } = require('sequelize')

const user_arrtibutes_filter = ['id','first_name','last_name','middle_name','username'];

//list all friend requests stored in the database
router.get("/", async (req, res, next) => {
    try {
        const all_friend_request = await User.findAll({ 
            include: [
                {
                  model: User,
                  as: 'Friends_requests',
                  through: friend_request,
                  attributes: user_arrtibutes_filter,
                  right: true
                },
              ],
              attributes: user_arrtibutes_filter,
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
        const user_id = req.query.userid;
        const friend_request_data = await User.findAll({ 
            include: [
                {
                  model: User,
                  as: 'Friends_requests',
                  through: friend_request,
                  foreignKey: 'onwerid',
                  otherKey: 'targetid',
                  attributes: user_arrtibutes_filter,
                },
              ],
              attributes: user_arrtibutes_filter,
              order: [['id', 'ASC']],
              where:{id:user_id} 
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
        const currentUser_id = req.body.requester;
        const targetUser_id = req.body.accepter;

        if (currentUser_id == targetUser_id) {
            throw new Error
        }

        const results = await db.transaction(async (t) => {
            const requester = await User.findOne({
                where:{id:currentUser_id} 
            }, {
                transaction : t
            });
            if (!requester) {
                res.status(404);
                throw new Error("No such user found")
            };

            const accepter = await User.findOne({
                where:{id:targetUser_id}
            }, {
                transaction : t
            });
            if (!accepter) {
                res.status(404);
                throw new Error("No such user found")
            };

            // check if current user and target user are already friends
            await friend_list.findOne({
                where: {
                    [Op.or]: [
                        {
                            ownerid: currentUser_id,
                            friendid: targetUser_id,
                        },
                        {
                            ownerid: currentUser_id,
                            friendid: targetUser_id,
                        },
                    ],
                },
            }, {
                transaction : t
            }).then((results) => {
                if (results) {
                    // res.status(400);
                    throw new Error("friend already exists");
                }
            });

            const reuqest = await friend_request.create({
                ownerid: currentUser_id,
                targetid: targetUser_id
            }, {
                transaction : t
            }).catch(error => {
                // res.status(400);
                error.message = "friend already request"
                throw error;
            });

            return reuqest
        });
    
        results?
            res.status(200).json(results)
            :res.send("Current User's Friend Request Not Found");
    }catch(error){
        console.error("error -> ", error);
        res.send({message : error.message}); // {message : "error"}
        next(error);
    }
})

router.post("/acceptRequest", async (req, res, next) => {
    try{
        const currentUser_id = req.body.accepter;
        const targetUser_id = req.body.requester;

        const results = await db.transaction(async t =>{
            
            //the user who accepts the friend request
            const accepter = await User.findOne({ where:{id:currentUser_id} }, {transaction : t});
            if (accepter == null) {
                res.status(404);
                throw new Error("User not found");
            }

            //the user who sends the friend request
            const requester = await User.findOne({ where:{id:targetUser_id} }, {transaction : t});
            if (requester == null) {
                res.status(404);
                throw new Error("User not found");
            }

            await friend_list.create({
                ownerid: currentUser_id,
                friendid: targetUser_id
            }, {transaction : t}).catch(err => {
                err.message = "firend aleady exsist"
                throw err;
            });

            const deleteRequest = await friend_request.destroy({
                where : {
                    ownerid : targetUser_id,
                    targetid:currentUser_id
                }
            }, {transaction : t});

            return deleteRequest;
        });
        results?
            res.status(200).json({result: true})
            :res.status(404).send({result: false, message : "Current User's Friend Request Not Found"});
    }catch(error){
        res.status(500).json({result: false, message : error.message});
        next(error);
    }
})

router.get("/receiving", async (req, res, next) => {
    try{
        const target_id = req.query.targetid;
        const sql = `SELECT 
                        owner.id,
                        owner.first_name,
                        owner.middle_name,
                        owner.last_name,
                        owner.username
                    FROM
                        users as owner
                    LEFT JOIN
                        friend_requests as fr
                    ON
                        owner.id = fr.ownerid
                    WHERE
                        fr.targetid = '${target_id}'
                    ;`;
        const [results, metadata] = await db.query(sql).catch(error => console.error(error));
        results?
            res.status(200).json(results)
            :res.status(404).send("Current User's Friend Request Not Found");
    }catch(error){
        next(error);
    }
})

// delete friend
router.delete("/", async (req, res, next) => {
    var current_user_id = req.query.currentUser
    var friend_id =  req.query.friend
    try{
        const results = await db.transaction(async t =>{
            const results = await friend_list.destroy({
                where: {
                    [Op.or] : [
                        {
                            ownerid : current_user_id,
                            friendid : friend_id
                        }, 
                        {
                            ownerid : friend_id,
                            friendid : current_user_id
                        }
                    ]
                }
            });

            return results
        })

        results ?
        res.status(200).json(results)
        :res.status(404).send("Current User's Friend Delete Failed");
    } catch(error) {
        res.status(500).json({message : error.message});
        next(error);
    }
})

router.delete("/rejectRequest", async (req, res, next) => {
    var current_user_id = req.query.currentUser
    var sender_id =  req.query.sender
    try{
        const results = await db.transaction(async t =>{
            const results = await friend_request.destroy({
                where: {

                    ownerid: sender_id,
                    targetid: current_user_id
                }
            });

            return results
        })

        results ?
        res.status(200).json(results)
        :res.status(404).send("Current user rejcet friend_request Failed");
    } catch(error) {
        res.status(500).json({message : error.message});
        next(error);
    }
})
module.exports = router;