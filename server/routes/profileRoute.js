const express = require("express");
const {getProfile, updateProfile, getSellerDetail} = require('../controllers/profileController')
const {isAuthenticatedUser} = require('../middleware/auth')
const {userData} = require("../middleware/userData")


const router = express.Router();

// --seller
router.route("/user/profile").get(isAuthenticatedUser, userData, getProfile);

router.route("/user/profile").put(isAuthenticatedUser, userData, updateProfile);


// --user
router.route("/seller/profile/:id").get(getSellerDetail);




module.exports = router;