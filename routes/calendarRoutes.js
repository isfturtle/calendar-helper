const request = require("request")
const passport = require("passport")
const mongoose = require("mongoose")
const User = require("../models/User")
const moment = require("moment");

module.exports = app => {
    //Gets all calendars for the logged in user
    app.get("/api/user/calendars", (req, res) => {
        User.findById(req.user, (err, user) => {
            request({
                url: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
                headers: {
                    "Authorization": `Bearer ${user.accessToken}`
                }
            }, (err, response, body) => {
                const calendars = JSON.parse(body)
                res.send(calendars);
            })
        })
    })

    //Posts calendars to user's entry in database
    app.post("/api/user/calendars", (req, res) => {
        User.findById(req.user, { calendars: ["bl4fptbv5vridpa9e8qn2k5bj8@group.calendar.google.com"], configured: true }, (err, user) => {
            res.redirect("/home");
        })
    })

    //loops through a user's calendars, gets the events for all of them into an array, sorts the array by date, then sends it
    app.get("/api/user/events", (req, res) => {
        const startDate = moment().format("YYYY-MM-DD");
        const endDate = moment().add(7, "days").format("YYYY-MM-DD");
        User.findById(req.user, async (user) => {
            let events = [];
            for (i = 0; i < user.calendars.length; i++) {
                await request({
                    url: `https://www.googleapis.com/calendar/v3/calendars/${user.calendars[i]}/events`,
                    headers: {
                        "Authorization": `Bearer ${user.accessToken}`
                    }
                },
                    (err, response, body) => {
                        let evts = JSON.parse(body).items;
                        events = events.concat(evts);
                    })
            }
            events.sort((a,b) => {
                a = moment(a.start.dateTime);
                b = moment(b.start.dateTime);
                return a.diff(b);
            });
            res.send(events);
        })
    })
}