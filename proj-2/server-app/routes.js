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
        if (["POST", "PUT"].includes(req.method)) console.log(`Body:\n${JSON.stringify(req.body, null, 2)}`);
        return next();
    } catch (error) {
        console.log(error);
    }
});

let tester = (req, res) => res.status(200).json(new Date().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));

// user routes
app.post("/users/register", UserAPI.userRegister);
app.post("/users/signin", UserAPI.userLogin);
app.put("/users/signout", UserAPI.ensureAuthenticated, UserAPI.userLogout);

// event routes
app.get("/events", EventAPI.getEvents);
app.get("/event/:eventId", EventAPI.getEvent);
app.post("/events", UserAPI.ensureAuthenticated, EventAPI.createEvent);
app.delete("/events/:eventId", UserAPI.ensureAuthenticated, EventAPI.checkOwner, EventAPI.deleteEvent);
app.put("/events/:eventId", UserAPI.ensureAuthenticated, EventAPI.checkOwner, EventAPI.updateEvent);
app.put("/events/:eventId/register", UserAPI.ensureAuthenticated, EventAPI.registerEvent);
app.post("/create-events", EventAPI.createEvents);

// fallback and tester routes
app.get("/testing", tester);
app.get("*", tester);
app.post("*", tester);

module.exports = app;