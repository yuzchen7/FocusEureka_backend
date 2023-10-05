const router = require('express').Router();
const{Weekdays} = require('../db/models');

router.get('/', async (req, res) => {
    try{
        const allWeekdays = Weekdays.findAll();
        allWeekdays
        ?res.status(200).json(allWeekdays)
        :res.status(404).json("404 Not Found")
    }catch(error){
        next(error);
    }
})
module.exports = router;