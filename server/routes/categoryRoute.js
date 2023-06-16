// 
const express = require("express");
const {createCategory, updateCategory, getAllCategories} = require('../controllers/categoryController')
// const {isAuthenticatedUser} = require('../middleware/auth')
// const {userData} = require("../middleware/userData")


const router = express.Router();


router.route("/categories/createCategory").post(createCategory);

router.route("/categories/updateCategory").put(updateCategory);

router.route("/categories").get(getAllCategories)

module.exports = router;