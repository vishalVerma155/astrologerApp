const Admin = require('../../models/admin/admin.model.js');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.js');
const generateJWT = require('../../utils/jwt.js');
const AstroUser = require('../../models/user.model.js')

// user register controller
const registerAdmin = async (req, res) => {

    try {
        const { firstName, email, phoneNumber, password, lastName } = req.body; // get data from body

        // check blank fields
        const isBlank = [firstName, email, phoneNumber, password].some(field => field.trim() === "");


        if (isBlank) {
            return res.status(401).json({ Message: "Name, email, phoneNumber, password are compulsary" });
        }

        // check if admin is already existed
        const isAdminExisted = await Admin.findOne();

        if (isAdminExisted) {
            return res.status(401).json({ Message: "Admin is already existed. There cant be two admin" });
        }


        const hashedPassword = await hashPassword(password); // hash current password

        // create admin
        const admin = new Admin({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword
        })

        // save admin
        await admin.save();

        if (!admin) {
            return res.status(404).json({ Message: "Admin not found. There is something problem in admin data saving" });
        }

        // make payload for jwt
        const payload = {
            _id: admin._id,
            email: admin.email
        };

        // generate access token
        const accessToken = generateJWT(payload);

        res.cookie("AccessToken", accessToken);

        // return response
        res.status(200).json({ Message: "Admin has been  successfully register.", admin, token : accessToken });

    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }

};

// login admin
const loginAdmin = async (req, res) => {

    try {
        const { email, password } = req.body;

        // check blank fields
        const isBlank = [email, password].some(fields => fields.trim() === "");

        if (isBlank) {
            return res.status(401).json({ Message: "All fields are compulsary" });
        }

        // check if user is existed
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ Message: "Admin is not existed." });
        }

        // compare password
        const isPasswordCorrect = await comparePassword(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ Message: "Invalid password" });
        }


        // payload for jwt
        const payload = {
            _id: admin._id,
            email: admin.email
        };

        // generate jwt token
        const accessToken = generateJWT(payload);

        res.cookie("AccessToken", accessToken); // set access token in cookies

        // return response
        res.status(200).json({ Message: "Admin has been  sucessfully Loged in.", admin, token : accessToken });

    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }

};


// get admin profile details
const getAdminProfile = async (req, res) => {
    try {
        const userId = req.user._id; // take admin id from loged in user
        const admin = await Admin.findById(userId, { password: 0 }); // find admin
        return res.status(200).json({ admin }); // return response
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// update admin profile
const updateAdminProfile = async (req, res) => {
    try {
        const body = req.body;
        const adminId = req.user._id;

        if (!body || !adminId) {
            return res.status(404).json({ Message: "credentials not found" }); // details and admin id
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { ...body }, { new: true, runValidators: true }); //find and update admin

        if (!updatedAdmin) {
            return res.status(404).json({ Message: "admin not found" });
        }

        return res.status(200).json({ status: "successful", updated_Admin: updatedAdmin }); // return response
    } catch (error) {
        return res.status(400).json({ Error: error.message });

    }
}

// // delete user profile

const deleteAdminProfile = async (req, res) => {
    try {
        const userId = req.user?._id; // get admin id
        const { password } = req.body; // get password for verification
        const admin = await Admin.findById(userId); // find admin

        if (!admin) {
            return res.status(404).json({ Message: "Admin not found" });
        }

        const isPasswordCorrect = await comparePassword(password, admin.password); // compare password with saved password
        if (!isPasswordCorrect) {
            return res.status(402).json({ Message: "Wrong password" });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(admin._id); // find and delete admin

        res.clearCookie("AccessToken"); // clear cookies for logout

        return res.status(200).json({ Message: "Adminr has been sucessfully deleted", deleted_Admin: deletedAdmin }); // return response
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// change admin password
const changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body; // get details

        if (currentPassword.trim() === "" || newPassword.trim() === "") {
            return res.status(401).json({ Message: "Please enter all fields" });
        }

        const admin = await Admin.findById(req.user._id); // get admin


        // compare password
        const isPasswordCorrect = await comparePassword(currentPassword, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ Message: "password is not matched" });
        }

        const newHashedPassword = await hashPassword(newPassword); // hash new password
        admin.password = newHashedPassword; // save new hashed password in database
        await admin.save(); // save admin with new password

        return res.status(200).json({ Message: "Password has been chenged" }); // return response
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// logout affiliate
const logoutAdmin = (req, res) => {
    try {
        res.clearCookie("AccessToken"); // clear cookies for logout
        return res.status(200).json({
            Message: "User logedout sucessfully"
        })
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// get all user details
const getAllUserDetails = async (req, res) => {
    try {
        const allUsers = await AstroUser.find(); // get all users from database
        return res.status(200).json({  allUsers });
    } catch (error) {
        return res.status(400).json({ Error: error.message }); // error handling
    }
}

// delete any user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId; // get user id

        if (!userId) {
            return res.status(404).json({ Message: "User id not found" });
        }

        const deletedUser = await AstroUser.findByIdAndDelete(userId); // find user and delete

        if (!deletedUser) {
            return res.status(404).json({ Message: "Wrong user id. User not found" });
        }

        return res.status(200).json({ status: "sucessfull", deleted_User: deletedUser });
    } catch (error) {
        return res.status(400).json({ Error: error.message }); // error handling
    }
}

module.exports = { registerAdmin, loginAdmin, getAdminProfile, deleteAdminProfile, logoutAdmin, changeAdminPassword, getAllUserDetails, deleteUser, updateAdminProfile }
