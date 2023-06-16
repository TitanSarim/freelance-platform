const express = require("express");
const {addMoney, getWalletDetail} = require('../controllers/walletController')
const {isAuthenticatedUser} = require('../middleware/auth')
const {userData} = require("../middleware/userData")


const router = express.Router();


router.route("/user/wallet/deposit").put(isAuthenticatedUser, userData, addMoney);

router.route("/user/wallet/info").get(isAuthenticatedUser, userData, getWalletDetail)
// account type


module.exports = router;