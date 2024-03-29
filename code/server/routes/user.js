const express=require('express');
const user = require('../controller/profile');
const requireAuth = require('../middleware/requireAuth');
const router=express.Router();

router.use(requireAuth);
router.get('/getUser/:id',user.getUserByID);
router.post('/verify',user.verifyPassword);
router.patch('/changePassword/:id',user.changePassword); 
router.patch('/updateProfilePicture/:id',user.updateProfilePicture);


module.exports = router;