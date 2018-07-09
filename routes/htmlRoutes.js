const path = require("path");

module.exports = (app) => {
    app.get("/setup", (req, res) => {
        res.sendFile(path.join(__dirname, "/../public/setup.html"));
    })

    app.get("/home", (req, res) => {
        res.sendFile(path.join(__dirname, "/../public/home.html"))
    })
}