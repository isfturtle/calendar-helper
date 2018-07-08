const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')
const GoogleTokenStrategy = require("passport-google-token").Strategy

const User = require("../models/User")

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  console.log(id)
  done(null, id)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // we already have a record with the given profile ID
          existingUser.accessToken = accessToken;
          existingUser.refreshToken = refreshToken;
          existingUser.save();
          done(null, existingUser)
        } else {
          // we don't have a user record with this ID, make a new record!
          new User({ googleId: profile.id, accessToken: accessToken, refreshToken: refreshToken })
            .save()
            .then(user => done(null, user))
        }
      })
        
      })
    
  )

  passport.use(new GoogleTokenStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    User.findOne({ googleId: profile.id }).then(existingUser => {
      if (existingUser) {
        // we already have a record with the given profile ID
        existingUser.accessToken = accessToken;
        existingUser.refreshToken = refreshToken;
        existingUser.save();
        done(null, existingUser)
      } else {
        // we don't have a user record with this ID, make a new record!
        new User({ googleId: profile.id, accessToken: accessToken, refreshToken: refreshToken })
          .save()
          .then(user => done(null, user))
      }
    })
      
    }
  
));
