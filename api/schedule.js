const router = require('express').Router();
const{Schedule,User} = require('../db/models');
const user_arrtibutes_filter = ['id','first_name','last_name','middle_name','username'];

router.get('/', async (req, res) => {
    console.log("get schedule triggered");
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
module.exports = router;