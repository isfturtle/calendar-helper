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
        async (req, res) => {
            if(req.user.configured){
                await res.redirect("/home");
            } else {
                await res.redirect("/setup");
            }
        }
    )



}