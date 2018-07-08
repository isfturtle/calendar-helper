const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  googleId: String,
  configured: {type: Boolean, default: false},
  calendars: [String],
  events: {type: Schema.Types.ObjectId},
  accessToken: String,
  refreshToken: String
})

module.exports = mongoose.model('users', userSchema)