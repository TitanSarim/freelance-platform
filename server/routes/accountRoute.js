const express = require("express");
const {getInfo, updateInfo} = require('../controllers/account_infoController')
const {isAuthenticatedUser} = require('../middleware/auth')
const {userData} = require("../middleware/userData")


const router = express.Router();

router.route("/account/setting").get(isAuthenticatedUser, userData, getInfo);

router.route("/account/setting").put(isAuthenticatedUser, userData, updateInfo);


// account type


module.exports = router;