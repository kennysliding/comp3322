const express = require("express");
const app = express.Router();
const UserAPI = require("./api/user.js");
const EventAPI = require("./api/event.js");
const cors = require("cors");
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// global middleware
app.use((req, res, next) => {
    try {
        console.log(`Credential:\n${JSON.stringify(req.signedCookies, null, 2)}`);
        if (req.method === "POST") console.log(`Body:\n${JSON.stringify(req.body, null, 2)}`);
        return next();
    } catch (error) {
        console.log(error);
    }
});

let tester = (req, res) => res.status(200).json(new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));

// user routes
app.post("/users/register", UserAPI.userRegister);
app.post("/users/signin", UserAPI.userLogin);

// event routes
app.get("/events", tester);
app.post("/events", tester);
app.delete("/events/:eventId", tester);
app.put("/events/:eventId", tester);
app.put("/events/:eventId/register", tester);

// fallback and tester routes
app.get("/testing", tester);
app.get("*", tester);
app.post("*", tester);

module.exports = app;