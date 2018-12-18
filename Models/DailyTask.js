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
    default: false,
  },
  createdAt: {
    default: Date.now,
  },
})

module.exports = mongoose.model('dailytasks', DailyTaskSchema)
