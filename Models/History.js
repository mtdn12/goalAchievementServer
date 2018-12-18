const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistorySchema = new Schema({
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
  isDone: {
    type: Boolean,
    required: true,
  },
  timeAction: {
    type: Date,
    required: true,
  },
  createdAt: {
    default: Date.now,
  },
})

module.exports = mongoose.model('historys', HistorySchema)
