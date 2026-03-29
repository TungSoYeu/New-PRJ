const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middleware/auth');

// Profile yêu cầu đăng nhập
router.use(requireAuth);

router.get('/', userController.getProfile);
router.put('/', userController.updateProfile);

// Đơn hàng nằm trong user scope
const cartController = require('../controllers/cartController');
router.get('/orders', cartController.getOrders);

module.exports = router;
