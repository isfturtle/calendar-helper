const request = require("request")
const passport = require("passport")

module.exports = app => {
    app.get("/api/calendars", (req, res) => {
        request({
            url: "https://www.googleapis.com/calendar/v3/users/me/calendarList", 
            headers: {
                "Authorization": `Bearer ya29.GlzwBfPvH5EF89R2zEszDsF3CRENhh8gtta4J-4AlBqsZnRnoel09DCPdvm9agG77gD7EkF09e8brXCQ_tXgqKQMANIzrOnjUzMvdmcJ9-6jbboVI38ndE4J82APGw`
            }
        }, (err, response, body) => {
            const calendars = JSON.parse(body)
            res.send(calendars);
        })
    })
}