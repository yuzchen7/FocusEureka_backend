const router = require('express').Router();
const { User, group, group_member, group_request } = require('../db/models');

router.get('/', async (req, res, next) => {

});

router.get('/mygroups', async (req, res, next) => {
   try {
      const user_id = req.query.userid;
      const result = await group.findAll({
         where : {
            ownerid : user_id
         }
      }).catch(err => {
         res.status(400);
         err.message = "SQL error";
         throw err;
      });

      result ?
         res.status(200).json(result)
         : res.status(404).send({message: "No user group founded"});
   } catch (err) {
      res.status(400).send({message: err.message});
      next(err);
   }
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