const express = require("express");
// const upload = require("../middleware/avatarMiddleware")
const {isAuthenticatedUser} = require('../middleware/auth')
const {createUserAvatar, getUserProfile} = require("../controllers/avatarController");


const router = express.Router();


router.route("/me/addAvatar").post(isAuthenticatedUser, createUserAvatar);
router.route("/me/profile").get(isAuthenticatedUser, getUserProfile);


module.exports = router;