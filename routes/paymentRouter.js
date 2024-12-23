// const express = require('express');
// const router = express.Router();
// const razorpay = require('../utils/razorpay');
// const isLoggedIn = require('../middleware/isLoggedIn');

// router.post('/create-order', isLoggedIn, async (req, res) => {
//   const { totalAmount } = req.body;

//   try {
//     const options = {
//       amount: totalAmount * 100, // Razorpay expects the amount in paise
//       currency: 'INR',
//       receipt: `receipt_order_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json({ orderId: order.id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error creating order', error: error.message });
//   }
// });

// module.exports = router;