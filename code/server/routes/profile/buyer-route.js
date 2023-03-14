const express=require('express');
const {getBuyerByEmail, patchBuyerByEmail} = require('../../controller/profile-controller');
const requireAuth = require('../../middleware/requireAuth');
const router=express.Router();

router.use(requireAuth);
router.get('/:email',getBuyerByEmail);
router.patch('/:email',patchBuyerByEmail);

module.exports = router;