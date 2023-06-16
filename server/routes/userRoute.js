const express = require("express");
const {createUser, loginUser, getUser, logOut} = require("../controllers/userContoller");
const {createAccountType} = require("../controllers/accountTypeController");
const {isAuthenticatedUser} = require('../middleware/auth')
const {userData} = require("../middleware/userData")

const router = express.Router();


router.route("/userRegister").post(createUser);

router.route("/userLogin").post(loginUser, userData);

router.route("/profileHeader").get(isAuthenticatedUser, getUser)

router.route("/userLogout").get(logOut);

router.route("/me/accountType").post(isAuthenticatedUser, createAccountType, userData);



// account type


module.exports = router;