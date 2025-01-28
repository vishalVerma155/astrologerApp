const AstroUser = require('../../models/user.model.js');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.js')
const generateJWT = require('../../utils/jwt.js')

// user register controllers
const registerUser = async (req, res) => {

    try {
        const { fullName, email, phoneNumber, password, gender, dateOfBirth, birthTime } = req.body;

        // check blank fields
        const isBlank = [fullName, email, phoneNumber, password, gender, dateOfBirth, birthTime].some(field => field.trim() === "");


        if (isBlank) {
            return res.status(401).json({ Message: "All fields are compulsary" });
        }

        // check if user is already existed
        const isUserExisted = await AstroUser.findOne({ $or: [{ phoneNumber }, { email }] });

        if (isUserExisted) {
            return res.status(401).json({ Message: "User is already existed. Please login or choose other email addres or phone number" });
        }


        const hashedPassword = await hashPassword(password);
        // create user
        const newUser = new AstroUser({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            gender,
            dateOfBirth,
            birthTime
        })

        // save user
        await newUser.save();

        const astroUser = await AstroUser.findOne({ $or: [{ phoneNumber }, { email }] });

        if (!astroUser) {
            return res.status(404).json({ Message: "User not found. There is something problem in user data saving" });
        }

        const payload = {
            _id: astroUser._id,
            email: astroUser.email
        };

        // generate access token
        const accessToken = generateJWT(payload);

        res.cookie("AccessToken", accessToken);

        // return response
        res.status(200).json({ Message: "User has been  successfully register.", astroUser, token : accessToken });

    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }

};

// login user
const loginUser = async (req, res) => {

    try {
        const { userName, password } = req.body;

        // check blank fields
        const isBlank = [userName, password].some(fields => fields.trim() === "");

        if (isBlank) {
            return res.status(401).json({ Message: "All fields are compulsary" });
        }

        // check if user is existed
        const astroUser = await AstroUser.findOne({ $or: [{ phoneNumber: userName }, { email: userName }] });

        if (!astroUser) {
            return res.status(401).json({ Message: "User is not existed." });
        }

        // compare password
        const isPasswordCorrect = await comparePassword(password, astroUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ Message: "Invalid password" });
        }


        const payload = {
            _id: astroUser._id,
            email: astroUser.email
        };

        // generate jwt token
        const accessToken = generateJWT(payload);

        res.cookie("AccessToken", accessToken);

        // return response
        res.status(200).json({ Message: "User has been  sucessfully Loged in.", astroUser, token : accessToken });

    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }

};

// get user profile details
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id; // take affiliate id from request
        const user = await AstroUser.findById(userId, { password: 0 });
        return res.status(200).json({ Astro_User: user }); // return response
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// // delete user profile

const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id; // get user id
        const { password } = req.body;
        const user = await AstroUser.findById(userId); // find user

        if (!user) {
            return res.status(404).json({ Message: "User not found" });
        }

        const isPasswordCorrect = await comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(402).json({ Message: "Wrong password" });
        }

        const deletedUser = await AstroUser.findByIdAndDelete(user._id); // find and delete user

        res.clearCookie("AccessToken"); // clear cookies for logout
        return res.status(200).json({ Message: "Astro user has been sucessfully deleted", deleted_User: deletedUser }); // return response
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// change User password
const changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body; // take details

        if (currentPassword.trim() === "" || newPassword.trim() === "") {
            return res.status(401).json({ Message: "Please enter all fields" });
        }

        const user = await AstroUser.findById(req.user._id); // get user


        // compare password
        const isPasswordCorrect = await comparePassword(currentPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ Message: "password is not matched" });
        }

        const newHashedPassword = await hashPassword(newPassword);
        user.password = newHashedPassword;
        await user.save();

        return res.status(200).json({ Message: "Password has been chenged" });
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// update user details
const updateUserProfile = async (req, res) => {
    try {
        const body = req.body;
        const userId = req.user._id;

        if (!body || !userId) {
            return res.status(404).json({ Message: "credentials not found" }); // details and user id
        }

        const updatedUser = await AstroUser.findByIdAndUpdate(userId, { ...body }, { new: true, runValidators: true }); //find and update admin

        if (!updatedUser) {
            return res.status(404).json({ Message: "User not found" });
        }

        return res.status(200).json({ status: "successful", updated_User: updatedUser }); // return response
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

// logout affiliate
const logoutUser = (req, res) => {
    try {
        res.clearCookie("AccessToken"); // clear cookies for logout
        return res.status(200).json({
            Message: "User logedout sucessfully"
        })
    } catch (error) {
        return res.status(400).json({ Error: error.message });
    }
}

module.exports = { registerUser, updateUserProfile, getUserProfile, loginUser, logoutUser, changeUserPassword, deleteUserProfile };