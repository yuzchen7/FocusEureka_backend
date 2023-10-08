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

router.post('/newgroup', async (req, res, next) => {
   try {
      const ownerid = req.body.userid;
      const name = req.body.groupname ? req.body.groupname : "Unnamed";
      const meet_date = req.body.meetdate;
      const meet_time = req.body.meettime;
      const address = req.body.address;
      const city = req.body.city;
      const state = req.body.state;
      const zipcode = req.body.zip;

      const grouinfo = await group.findOne({
         where : {
            ownerid : ownerid, 
            name : name
         }
      }).then(async result => {
         if (result) {
            res.status(400);
            throw new Error("Group already exists");
         }

         const result_create = await group.create({
            ownerid, name, meet_date, meet_time,
            address, city, state, zipcode
         });

         result_create ?
            res.status(201).json(result_create)
            : res.status(400).send({message: "group create failed"});
      });

   } catch (err) {
      res.send({message: err.message});
      next(err);
   }
});

// get all the current group members by given group id information
router.get('/groupinfo', async (req, res, next) => {
   try {
      const group_id = req.query.groupid;
      const result = await group.findOne({
         include : [
            {
               model : User,
               attributes : ['id','first_name','last_name','middle_name','username']
            },
         ],
         where : {
            id : group_id
         }
      }).then(async result => {
         if (!result) { // make sure the group is already exists
            res.status(400);
            throw new Error("group is not exist");
         }
   
         const userinfo = await User.findOne({
            where : {
               id : result.ownerid
            },
            attributes : ['id','first_name','last_name','middle_name', 'username']
         }).catch(err => {
            res.status(400);
            err.message = "not able find group onwer";
            throw err;
         });
   
         if (!userinfo) { // make sure user info is vaild
            res.status(400);
            throw new Error("not able find group onwer");
         }
   
         delete result.dataValues.ownerid; //delete ownerid property from result json
         result.dataValues.onwer = userinfo; // add onwer user info ro result json

         return result;

      }).catch(err => {
         res.status(500);
         throw err;
      });

      result ?
         res.status(200).json(result)
         : res.status(400).send({message: "find group failed"});
   } catch (err) {
      res.send({message: err.message});
      next(err);
   }
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

router.get('/receiverequest', async (req, res, next) => {

});

router.post('/acceptrequest', async (req, res, next) => {

});

module.exports = router;