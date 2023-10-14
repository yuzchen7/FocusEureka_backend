const router = require('express').Router();
const { Schedule, User } = require('../db/models');
const db = require("../db");
const user_arrtibutes_filter = ['id', 'first_name', 'last_name', 'middle_name', 'username'];

router.get('/', async (req, res, next) => {
    try {
        const allWeekdays = await Schedule.findAll({
            include: [{
                model: User,
                attributes: user_arrtibutes_filter
            }]
        });
        allWeekdays
            ? res.status(200).json(allWeekdays)
            : res.status(404).json("404 Not Found")
    } catch (error) {
        next(error);
    }
})

router.get('/currentUser', async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const current_user_schdule = await Schedule.findOne({ where: { user_id: userId } });
        current_user_schdule
            ? res.status(200).json(current_user_schdule)
            : res.status(404).json("current user's schedule does not exist");
    } catch (error) {
        next(error);
    }
})

router.post('/create', async (req, res, next) => {
    try {
        const findUser = await User.findOne({ where: { id: req.body.user_id } });
        if (!findUser) {
            res.status(400);
            throw new Error("No such user found");
        }
        const user_schedule = await Schedule.create(req.body);
        user_schedule
            ? res.status(200).json(user_schedule)
            : res.status(404).json("failed to create user's schedule");
    } catch (error) {
        res.send({ message: error.message });
        next(error)
    }
})

router.put('/update', async (req, res, next) => {
    try {
        const updateData = req.body;
        const foundSchedule = await Schedule.findOne({ where: { user_id: updateData.user_id } })
        if (foundSchedule) {
            await foundSchedule.update(req.body);
            res.status(200).json(foundSchedule);
        } else {
            res.status(404).json("update unsuccessfully")
        }
    } catch (error) {
        next(error)
    }
})


router.get('/checkAvailableFriends', async (req, res, next) => {
    try {
        const weekday = req.query.weekday;
        const owner_id = req.query.owner_id;
        const sql = `
        SELECT 
                    u.id,
                    u.first_name,
                    u.middle_name,
                    u.last_name,
                    u.username
                FROM 
                    users AS u
                WHERE 
                    u.id IN (
                      SELECT friendid
                      FROM friend_lists AS fl left join schedules AS s on friendid = s.user_id
                      WHERE fl.ownerid = '${owner_id}' AND s.${weekday} = true
                    )
                or 
                    u.id IN (
                      SELECT ownerid
                      FROM friend_lists AS fl left join schedules AS s on ownerid = s.user_id
                      WHERE fl.friendid = '${owner_id}' AND s.${weekday} = true
                    )
                ;`
        const [AvailableFriends, metadata] = await db.query(sql).catch(error => console.error(error));
        AvailableFriends ?
            res.status(200).json(AvailableFriends)
            : res.status(404).json("No friends avaliable")
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.put('/reset', async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const result = await db.transaction(async (t) => {
            const resetSchedule = await Schedule.findOne({ where: { user_id: userId } }, { transaction: t })
            await resetSchedule.update({
                mon: true,
                tue: true,
                wed: true,
                thu: true,
                fri: true,
                sat: true,
                sun: true
            }, { transaction: t })

            return resetSchedule
        })
        result ?
            res.status(200).json(result)
            : res.status(404).json("rest failed")
    } catch (error) {
        console.log(error)
        next(error)
    }
})
module.exports = router;