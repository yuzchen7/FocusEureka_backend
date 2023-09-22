const router = require('express').Router();
const { friend_request } = require("../db/models");

router.get("/", async (req, res, next) => {
    try {
        const all_friend_request = await friend_request.findAll({ order: [['id', 'ASC']] });
        all_friend_request
            ? res.status(200).json(all_friend_request)
            : res.status(400).send("User List Not Found");
    } catch (error) {
        next(error);
    }
});

module.exports = router;