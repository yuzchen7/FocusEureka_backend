const router = require('express').Router();

// Mounting the route 
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/friend_request', require('./friend_request'));
router.use('/comments', require('./comments'));
router.use('/schedule', require('./schedule'));

router.use((req, res, next) => {
    const error = new Error("404 Not Found");
    error.status = 404;
    next(error);
  });
  
module.exports = router;