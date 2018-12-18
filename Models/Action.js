const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  tatic: {
    type: Schema.Types.ObjectId,
    ref: 'tatics',
  },
  action: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('actions', ActionSchema)
