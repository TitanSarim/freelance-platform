const express = require("express");
const {createOrder, getAllOrders, getOrderDetial, OrderDelivered, buyerOrderOpprovation, buyerDeliveryConversation, sellerDeliveryConversation} = require('../controllers/orderController')
const {isAuthenticatedUser} = require('../middleware/auth')
const {userData} = require("../middleware/userData")


const router = express.Router();

// buyer
router.route("/project/order/create").post(isAuthenticatedUser, userData, createOrder);



// check delivery buyer
router.route("/buyer/order")


// update delivery --approved --cencel --askfor revision
router.route("/buyer/orders/order/update_delivery").post(isAuthenticatedUser, userData, buyerOrderOpprovation)


// check conversation 
router.route("/buyer/orders/order/conversation").get(isAuthenticatedUser, userData, buyerDeliveryConversation) 


// get all orders --seller and buyer
router.route("/user/orders").get(isAuthenticatedUser, userData, getAllOrders);


// get single order detial --seller and buyer
router.route("/user/orders/order/:id").get(isAuthenticatedUser, userData, getOrderDetial)



// ================================================================================================


// seller routes
router.route("/seller/orders/order/deliver").post(isAuthenticatedUser, userData, OrderDelivered);

// seller conversation
router.route("/seller/orders/order/conversation").get(isAuthenticatedUser, userData, sellerDeliveryConversation);


// account type


module.exports = router;