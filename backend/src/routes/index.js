const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const productRoutes = require('./products');
const cartRoutes = require('./cart');
const userRoutes = require('./user');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/user', userRoutes);

module.exports = router;
