const express=require('express');
const { getAllCategories, getAllTypes,addMedicine } = require('../controller/add-medicine-controller');
// const requireAuth = require('../middleware/requireAuth');
const router=express.Router();

// router.use(requireAuth);
router.patch('/addNewMedicine/:id',addMedicine);
router.get('/findCateogry',getAllCategories);
router.get('/findType',getAllTypes);

module.exports = router;