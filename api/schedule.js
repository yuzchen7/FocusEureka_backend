const router = require('express').Router();
const{Schedule,User} = require('../db/models');
const user_arrtibutes_filter = ['id','first_name','last_name','middle_name','username'];

router.get('/', async (req, res,next) => {
    try{
        const allWeekdays = await Schedule.findAll({
            include:[{
                model:User,
                attributes: user_arrtibutes_filter
            }]
        });
        allWeekdays
        ?res.status(200).json(allWeekdays)
        :res.status(404).json("404 Not Found")
    }catch(error){
        next(error);
    }
})

router.get('/currentUser', async (req, res,next) => {
    try{
        const userId = req.query.userId;
        const current_user_schdule = await Schedule.findOne({where:{user_id:userId}});
        current_user_schdule
        ?res.status(200).json(current_user_schdule)
        :res.status(404).json("current user's schedule does not exist");
    }catch(error){
        next(error);
    }
})

router.post('/create', async (req, res, next) => {
    try{
        const findUser = await User.findOne({ where:{id:req.body.user_id} });
        if(!findUser){
            res.status(400);
            throw new Error("No such user found");
        }
        const user_schedule = await Schedule.create(req.body);
        user_schedule
        ?res.status(200).json(user_schedule)
        :res.status(404).json("failed to create user's schedule");
    }catch(error){
        res.send({message : error.message});
        next(error)
    }
})
module.exports = router;