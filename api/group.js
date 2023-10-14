const router = require('express').Router();
const { User, group, group_member, group_request } = require('../db/models');
const db = require('../db');

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

      const result_create = await db.transaction(async t => {
         const grouinfo = await group.findOne({
            where : {
               ownerid : ownerid, 
               name : name
            }
         }, {
            transaction : t
         }).catch(err => {
            err.message = "Group sql error";
            throw err;
         });

         if (grouinfo) {
            res.status(400);
            throw new Error("Group already exists");
         }

         const result_create = await group.create({
            ownerid, name, meet_date, meet_time,
            address, city, state, zipcode
         }, {
            transaction : t
         });

         const add_user = await group_member.create({
            group_id : result_create.dataValues.id,
            member_id : result_create.dataValues.ownerid
         }, {
            transaction : t
         });

         return result_create;
      });

      result_create ?
         res.status(201).json(result_create)
         : res.status(400).send({message: "group create failed"});
   } catch (err) {
      res.send({message: err.message});
      next(err);
   }
});

// get all the current group members by given group id information
router.get('/groupinfo', async (req, res, next) => {
   try {
      const group_id = req.query.groupid;
      
      const result = await db.transaction(async (t) => {
         const groupinfo = await group.findOne({
            include : [
               {
                  model : User,
                  attributes : ['id','first_name','last_name','middle_name','username']
               },
            ],
            where : {
               id : group_id
            }
         }, {
            transaction : t
         }).catch(err => {
            res.status(500);
            throw err;
         });

         if (!groupinfo) { // make sure the group is already exists
            res.status(400);
            throw new Error("group is not exist");
         }

         const userinfo = await User.findOne({
            where : {
               id : groupinfo.ownerid
            },
            attributes : ['id','first_name','last_name','middle_name', 'username']
         }, {
            transaction : t
         }).catch(err => {
            res.status(400);
            err.message = "not able find group onwer";
            throw err;
         });
         
         if (!userinfo) { // make sure user info is vaild
            res.status(400);
            throw new Error("not able find group onwer");
         }

         delete groupinfo.dataValues.ownerid;
         groupinfo.dataValues.onwer = userinfo;

         return groupinfo;
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
      
      const result = await db.transaction(async t => {
         const groupinfo = await group.findOne({
            where : {
               id : group_id
            }
         }, {
            transaction : t
         }).catch(err => {
            err.message = "error sql group info";
            throw err;
         });

         if (!groupinfo) {
            res.status(404);
            throw new Error("No User or onwer founded");
         }

         const acceptor_id = groupinfo.ownerid;

         const request_res = await group_request.create({
            requester_id, acceptor_id, group_id
         }, {
            transaction : t
         });

         return request_res;
      });

      result ?
         res.status(200).json({result, message: "request successfully created"})
         : res.status(404).send({message: 'group request failed'});

   } catch (err) {
      console.error(err);
      res.status(400).send({message: err.message});
      next(err);
   }
});

router.get('/receiverequest', async (req, res, next) => {
   try {
      const receiver_id = req.query.receiverid;
      const sql = `SELECT 
                     u.id,
                     u.first_name,
                     u.middle_name,
                     u.last_name,
                     u.username,
                     gr.group_id,
                     g.name
                  FROM 
                     group_requests gr
                  JOIN 
                     users u
                  ON
                     u.id = gr.requester_id
                  JOIN
                     groups g
                  ON
                     g.id = gr.group_id
                  where 
                     acceptor_id = '${receiver_id}'
                  ;`;

      const [results, metadata] = await db.query(sql).catch(error => console.error(error));

      results ?
         res.status(200).json(results)
         : res.status(404).send({message:"Founding receiver filed"});
   } catch (err) {
      console.log(err);
      res.status(400).send({message:"receiver request error"});
   }
});

router.get('/acceptrequest', async (req, res, next) => {
   try {
      const requester_id = req.query.requesterid;
      const acceptor_id = req.query.acceptorid;
      const group_id = req.query.groupid;

      const result = await db.transaction(async (t) => {
         const pending = await group_request.destroy({
            where: {
               requester_id,
               acceptor_id,
               group_id,
            }
         }, {
            transaction : t
         }).catch(err => {
            err.massage = "request pending error.";
            throw err;
         });

         console.log("number of line has be deleted ->", pending);
         if (!pending) {
            throw new Error("request pending not found.");
         }

         const result = await group_member.create({
            member_id : requester_id,
            group_id : group_id
         }, {
            transaction: t
         });

         return result;
      });

      result ?
         res.status(200).json(result) 
         : res.status(404).send({message: ""});

   } catch (err) {
      console.error(err);
      res.status(400).send({message: err.message});
      next(err);
   }
});

module.exports = router;