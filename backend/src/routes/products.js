const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAll);
router.get('/sale', productController.getSales);
router.get('/search', productController.search);
router.get('/brands', productController.getBrands);
router.get('/brand/:brand', productController.getByBrand);

module.exports = router;
