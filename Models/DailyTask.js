const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DailyTaskSchema = new Schema({
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
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('dailytasks', DailyTaskSchema)
