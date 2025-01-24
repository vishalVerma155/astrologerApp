const express = require('express');
const {registerAdmin, loginAdmin, getAdminProfile, deleteAdminProfile, logoutAdmin, changeAdminPassword, getAllUserDetails, deleteUser, updateAdminProfile } = require('../../controllers/admin/admin.controllers.js');
const verifyJWT = require('../../middleware/auth.middleware.js');


const router = express.Router();

// register admin
router.post("/registerAdmin", registerAdmin);

// log in admin
router.post("/loginAdmin", loginAdmin);

//  logout admin
router.post("/logoutAdmin", verifyJWT, logoutAdmin);

// change admin password
router.put("/changeAdminPassword", verifyJWT, changeAdminPassword);

// delete admin profile
router.delete("/deleteAdmin", verifyJWT, deleteAdminProfile);

// get admin profile
router.get("/getAdminProfile", verifyJWT, getAdminProfile);

// get all users
router.get("/getAllUserDetails", verifyJWT, getAllUserDetails);

// delete any user
router.delete("/deleteAnyUser/:userId", verifyJWT, deleteUser);

// update admin profile
router.put("/updateAdminProfile", verifyJWT, updateAdminProfile);

module.exports = router;