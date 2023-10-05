const router = require('express').Router();
const { User, group, group_member, group_request } = require('../db/models');

router.get('/', async (req, res, next) => {

});

router.get('/mygroups', async (req, res, next) => {
   
});

router.get('/newgroup', async (req, res, next) => {
   
});

router.post('/groupmember', async (req, res, next) => {

});

router.post('/grouprequest', async (req, res, next) => {

});

router.post('/acceptrequest', async (req, res, next) => {

});

module.exports = router;