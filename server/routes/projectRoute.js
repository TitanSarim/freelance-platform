const express = require("express");
const {createProject, getProjects, getUserProjects, getProject, updateProject, deleteProject} = require('../controllers/projectController')
const {isAuthenticatedUser} = require('../middleware/auth')
const {userData} = require("../middleware/userData")


const router = express.Router();


// buyer route
router.route("/buyer/projects").get(getProjects);
// buyer route
router.route("/buyer/project/:slug").get(getProject);



// seller route
router.route("/seller/createProject").post(isAuthenticatedUser, userData, createProject);

// seller route
router.route("/seller/projects").get(isAuthenticatedUser, userData, getUserProjects);

// seller route
router.route("/seller/project/:id").get(isAuthenticatedUser, userData, getProject);

// seller route
router.route("/seller/update/project/:id").put(isAuthenticatedUser, userData, updateProject);

// seller route
router.route("/seller/delete/project/:id").delete(isAuthenticatedUser, userData, deleteProject);


module.exports = router;