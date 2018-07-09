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
        User.findById(req.user, (err, user) => {
            user.calendars = req.body.calendars;
            user.configure = true;
            user.save((err, user) => {
                res.redirect("/home");
            })
        })
    })

    //loops through a user's calendars, gets the events for all of them into an array, sorts the array by date, then sends it
    app.post("/api/user/events", (req, res) => {
        const now = moment();
        const week = moment().week();
        const startDate = moment({week: week}).day(0).format();
        const endDate = moment({week: week}).day(6).format();
        const hours = req.body.hours;
        const goal = req.body.goal;
        User.findById(req.user, async (err, user) => {
            let events = [];
            //An array of 7 arrays, for sorting events into days of the week
            let day_events = [[],[],[],[],[],[],[]];
            let day_slots = [[],[],[],[],[],[],[]];
            //for (i = 0; i < user.calendars.length; i++) {
                await request({
                    url: `https://www.googleapis.com/calendar/v3/calendars/${user.calendars[0]}/events?timeMin=${startDate}&timeMax=${endDate}`,
                    headers: {
                        "Authorization": `Bearer ${user.accessToken}`
                    }
                },
                    (err, response, body) => {
                        let evts = JSON.parse(body).items;
                        events = events.concat(evts);
                        for(i=0; i<events.length; i++){
                            let day = moment(events[i].start.dateTime).day();
                            day_events[day].push(events[i]);
                        }
                        for(i=0; i<day_events.length; i++){
                            day_events[i].sort((a, b) => {
                                let a_hour = moment(a.start.dateTime).hour();
                                let a_minute = moment(a.start.dateTime).minute();
                                let b_hour = moment(b.start.dateTime).hour();
                                let b_minute = moment(b.start.dateTime).minute();
                                a = moment({hour: a_hour, minute: a_minute});
                                b = moment({hour: b_hour, minute: b_minute});
                                //let c = a.diff(b, "hour");
                                return b.diff(a);
                            })
                            for(j=0; j<day_events[i].length-1; j++){
                                let last_hour =moment(day_events[i][j].end.dateTime).hour();
                                let last_minute = moment(day_events[i][j].end.dateTime).minute();
                                let next_hour = moment(day_events[i][j+1].start.dateTime).hour();
                                let next_minute = moment(day_events[i][j+1].start.dateTime).minute();
                                let lastEnd = moment({hour: last_hour, minute: last_minute});
                                let nextStart = moment({hour: next_hour, minute: next_minute});
                                let diff = lastEnd.diff(nextStart, "hour");
                                if(diff > hours){
                                    if(lastEnd.hour()+hours<21 || nextStart.hour()-hours < 9){
                                        continue;
                                    }
                                    else {
                                        day_slots[i].push({start: lastEnd, end: nextStart});
                                    }
                                }
                            }
                        }
                        res.send(day_slots);
                        //res.send(events);
                        
                        // for(i=0; i<events.length-1; i++){
                        //     let lastEnd = moment(events[i].end.dateTime);
                        //     let nextStart = moment(events[i+1].start.dateTime)
                        //     let diff = lastEnd.diff(nextStart, "hour");
                        //     if(moment(events[i].end.dateTime).diff(moment(events[i+1].start), "hour")>hours){
                        //         //makes sure we don't schedule an event after 9PM or before 9AM
                        //         if(moment(events[i].end.dateTime).hour() + hours > 21 && moment(events[i+1].start.dateTime).hour - hours < 9){
                        //             continue;
                        //         }
                        //         else {
                        //             options.push({
                        //                 start: events[i].end.dateTime,
                        //                 end: events[i+1].start.dateTime
                        //             })
                        //         }
                        //     }
                        // }


                    })
            //}
            // events.sort((a,b) => {
            //     a = moment(a.start.dateTime);
            //     b = moment(b.start.dateTime);
            //     return a.diff(b);
            // });
            //res.send(events);
        })
    })
}