const path = require("path");

module.exports = (app) => {
    app.get("/setup", (req, res) => {
        res.sendFile(path.join(__dirname, "/../public/setup.html"));
    })

    app.post("/setup", (req, res) => {
        req.user.calendars = req.user.calendars.concat(req.body.calendars);
        req.user.configured = true;
        const user = req.user.save();
        res.redirect("/home");
    })
}