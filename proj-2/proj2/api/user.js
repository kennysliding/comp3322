const User = require("../model/user.model.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("Hi I am Kenny");
const shortId = require("shortid");
const userAPI = {
    ensureAuthenticated: async (req, res, next) => { // middleware for authentication
        try {
            let credential = req.signedCookies;
            if (!credential) throw "Not login";
            let user = await User.findOne({ email: credential.email });
            if (!user) throw "No user found";
            if (credential.sessionId !== user.sessionId) throw "Incorrect token";
            if (credential.sessionToken !== user.sessionToken) throw "Incorrect token";
            return next();
        } catch (error) {
            return res.status(403).json("Not Authenticated");
        }
    },
    userRegister: async (req, res) => {
        try {
            credential = req.body;
            let existAccount = await User.findOne({ "email": credential.email });
            if (existAccount) {
                return res.status(409).json({ message: "Email registered" });
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
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json("Server Error");
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
                    });
                    res.cookie("user", session.email, { maxAge: 6000000, signed: true }); // 100 minutes
                    res.cookie("sessionId", session.sessionId, { maxAge: 6000000, signed: true });
                    res.cookie("sessionToken", session.sessionToken, { maxAge: 6000000, signed: true });
                    return res.status(200).json({ message: "Successful Login" });
                }
            }
            return res.status(401).json({ message: "Incorrect Credential" })
        } catch (error) {
            return res.status(500).json({ message: "Server Error" });
        }
    }
}

module.exports = userAPI;