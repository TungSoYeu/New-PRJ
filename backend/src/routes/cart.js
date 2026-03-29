const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const requireAuth = require('../middleware/auth');

// Cart yêu cầu phải đăng nhập
router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/remove', cartController.removeFromCart);
router.post('/checkout', cartController.checkout);

module.exports = router;
