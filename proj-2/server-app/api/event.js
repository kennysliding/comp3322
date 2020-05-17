const User = require("../model/user.model.js");
const Event = require("../model/event.model.js");
const moment = require("moment");
const eventAPI = {
    checkOwner: async (req, res, next) => {
        try {
            let credential = req.signedCookies;
            let eventId = req.params.eventId || req.body.eventId;
            if (!eventId) return res.status(403).json({ message: "No eventId found" });
            let event = await Event.findOne({ eventId });
            let user = await User.findOne({ email: credential.user });
            if (event.creatorId !== user.userId) {
                return res.status(403).json({ message: "Not Owner" });
            }
            return next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    getEvents: async (req, res) => {
        try {
            let creator = req.cookies.name || "";
            let events = await Event.find({
                $or: [
                    { type: "public" },
                    { creator: creator }
                ]
            });
            return res.status(200).json({ events: events });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    getEvent: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let event = await Event.findOne({ eventId });
            return res.status(200).json({ event });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    createEvent: async (req, res) => {
        try {
            let eventContent = req.body;
            let existEvent = await Event.findOne({ "eventId": eventContent.eventId });
            if (existEvent) {
                return res.status(409).json({ message: "EventId registered" });
            }

            let creatorCredential = { ...req.signedCookies, ...req.cookies };
            let newEvent = new Event({
                ...eventContent,
                attenders: [creatorCredential.userId],
                creatorId: creatorCredential.userId,
                creator: creatorCredential.name,
            });

            let result = await newEvent.save();
            return res.status(201).json({ message: result });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    updateEvent: async (req, res) => {
        try {
            // update event
            let newEvent = req.body;
            let eventId = req.params.eventId;
            let updatedEvent = await Event.findOneAndUpdate({ eventId }, {
                $set: {
                    ...newEvent,
                    startTime: moment(newEvent.startTime),
                    endTime: moment(newEvent.endTime)
                }
            }, { new: true })
            if (updatedEvent) {
                return res.status(201).json({ message: "Edited", event: updatedEvent })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    deleteEvent: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let update = await Event.findOneAndDelete({ eventId });
            if (update) {
                return res.status(200).json({ message: "Deleted event" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    registerEvent: async (req, res) => {
        try {
            let eventId = req.params.eventId;
            let userId = req.cookies.userId;
            let event = await Event.findOne({ eventId });
            let message = "";
            if (event.attenders.includes(userId)) {
                event.attenders = event.attenders.filter(attender => attender !== userId);
                message = "Left";
            } else {
                event.attenders.push(userId);
                message = "Joined";
            }
            let newEvent = await Event.findOneAndUpdate({ eventId }, { $set: { attenders: event.attenders } }, { new: true });
            return res.status(200).json({ message, event: newEvent });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    },
    createEvents: async (req, res) => {
        try {
            let eventContent = req.body.events;
            eventContent.forEach(async event => {
                let newEvent = new Event({
                    ...event,
                    startTime: moment(event.startTime),
                    endTime: moment(event.endTime)
                })
                let result = await newEvent.save();
            })
            return res.status(200).json({ message: "Events created" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server Error" });
        }
    }
}

module.exports = eventAPI;