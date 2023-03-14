const express=require('express');
const { getMedicine,getType,getTypes,getStocks,addToStock } = require('../controller/inventory-controller');
// const requireAuth = require('../middleware/requireAuth');
const router=express.Router();

// router.use(requireAuth);
router.get('/getMedicines/:id',getMedicine);
router.get('/getType/:id',getType);
router.get('/getTypes/',getTypes);

router.get('/getStocks/',getStocks);
router.patch('/addToStock/:id',addToStock);
module.exports = router;