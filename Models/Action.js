const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActionSchema = new Schema({
  goal: {
    type: Schema.Types.ObjectId,
    ref: 'goals',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  tatic: {
    type: Schema.Types.ObjectId,
    ref: 'tatics',
  },
  objective: {
    type: Schema.Types.ObjectId,
    ref: 'objectives',
  },
  strategy: {
    type: Schema.type.ObjectId,
    ref: 'strategies',
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
