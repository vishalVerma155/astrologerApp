const express = require('express');
const {registerUser, loginUser, changeUserPassword,updateUserProfile, deleteUserProfile, logoutUser, getUserProfile} = require('../../controllers/web/user.controllers.js');
const verifyJWT = require('../../middleware/auth.middleware.js');


const router = express.Router();

// register user
router.post("/registerUser", registerUser);

// log in user
router.post("/loginUser", loginUser);

//  logout user
router.post("/logoutUser", verifyJWT, logoutUser);

// change user password
router.put("/changeUserPassword", verifyJWT, changeUserPassword);

// delete user profile
router.delete("/deleteUser", verifyJWT, deleteUserProfile);

// get user profile
router.get("/getUserProfile", verifyJWT, getUserProfile);

// update user profile
router.put("/updateUserProfile", verifyJWT, updateUserProfile);


module.exports = router;