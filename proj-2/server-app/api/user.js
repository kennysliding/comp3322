const User = require("../model/user.model.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("Hi I am Kenny");
const shortId = require("shortid");
const userAPI = {
    ensureAuthenticated: async (req, res, next) => { // middleware for authentication
        try {
            let credential = req.signedCookies;
            if (!credential) return res.status(403).json({ message: "Not login" });
            let user = await User.findOne({ email: credential.user });
            if (!user) return res.status(403).json({ message: "No user found" });
            if (credential.sessionId !== user.sessionId) return res.status(403).json({ message: "Incorrect token" });
            if (credential.sessionToken !== user.sessionToken) return res.status(403).json({ message: "Incorrect token" });
            return next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    userRegister: async (req, res) => {
        try {
            credential = req.body;
            let existAccount = await User.findOne({ "email": credential.email });
            if (existAccount) {
                return res.status(409).json({ message: "Duplicated user's email address" });
            }

            let newUser = new User({
                userId: credential.userId || null,
                name: credential.name || "",
                alias: credential.alias || "",
                email: credential.email || "",
                password: cryptr.encrypt(credential.password),
                sessionId: credential.sessionId || "",
                sessionToken: credential.sessionToken || ""
            });
            let result = await newUser.save();
            return res.status(201).json({ message: "Successfully registered" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    userLogin: async (req, res) => {
        try {
            let credential = req.body;
            let existAccount = await User.findOne({ "email": credential.email });
            if (existAccount) {
                let userPassword = cryptr.decrypt(existAccount.password)
                if (userPassword === credential.password) {
                    let sessionId = shortId.generate();
                    let sessionToken = shortId.generate();
                    let session = await User.findOneAndUpdate(
                        { "email": credential.email }, {
                        $set: { sessionId, sessionToken }
                    }, { new: true });
                    res.cookie("user", session.email, { maxAge: 6000000, signed: true }); // 100 minutes
                    res.cookie("sessionId", session.sessionId, { maxAge: 6000000, signed: true });
                    res.cookie("sessionToken", session.sessionToken, { maxAge: 6000000, signed: true });
                    res.cookie("name", session.alias, { maxAge: 6000000, signed: false });
                    res.cookie("userId", session.userId, { maxAge: 6000000, signed: false })
                    return res.status(200).json({ message: "Successful Login" });
                }
            }
            return res.status(401).json({ message: "Unauthorized access" })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    userLogout: async (req, res) => {
        try {
            let credential = req.signedCookies;
            let user = await User.findOneAndUpdate({ email: credential.user },
                {
                    $set: { sessionId: "", sessionToken: "" }
                });
            return res.status(201).json({ message: "Successful Logout" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    }
}

module.exports = userAPI;