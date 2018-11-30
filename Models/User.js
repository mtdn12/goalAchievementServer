const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
})

module.exports = mongoose.model('users', UserSchema)
