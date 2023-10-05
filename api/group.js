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

// onwer -> user
router.post('/groupinvite', async (req, res, next) => {
   try {
      const requester_id = req.body.requestid; // group onwer
      const acceptor_id = req.body.acceptid; // user
      const group_id = req.body.groupid;

      const userinfo = await User.findOne({
         where : {
            id : acceptor_id
         }
      }).then (async result => {
         if (!result) {
            throw new Error("no such user founded");
         }

         const create_result = await group_request.create({
            requester_id, acceptor_id, group_id
         });

         create_result ?
            res.status(200).json({create_result, message: "invited successfully"})
            : res.status(400).send({message: "invited failed"});
      });

   } catch (err) {
      console.error(err);
      res.status(400).send({message: err.message});
      next(err);
   }
});

// user -> onwer
router.post('/grouprequest', async (req, res, next) => {
   try {
      const requester_id = req.body.requestid; // user
      const group_id = req.body.groupid; // onwer group
      
      const groupinfo = await group.findOne({
         where : {
            id : group_id
         }
      }).then(async result => {
         if (!result) {
            res.status(404);
            throw new Error("No User or onwer founded");
         }

         const acceptor_id = result.ownerid;

         const request_res = await group_request.create({
            requester_id, acceptor_id, group_id
         });

         request_res ?
            res.status(200).json({request_res, message: "request successfully created"})
            : res.status(404).send({message: 'group request failed'});
      });

   } catch (err) {
      console.error(err);
      res.status(400).send({message: err.message});
      next(err);
   }
});

router.post('/acceptrequest', async (req, res, next) => {

});

module.exports = router;