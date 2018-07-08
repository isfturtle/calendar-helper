const passport = require("passport")


module.exports = app => {
    app.get(
        "/auth/google",
        passport.authenticate("google", {
            scope: ["https://www.googleapis.com/auth/calendar", "profile"]
        })
    )

    app.get(
        "/auth/google/callback",
        passport.authenticate("google"),
        (req, res) => {
            if(req.user.configured){
                res.redirect("/home");
            } else {
                res.redirect("/setup");
            }
        }
    )



}