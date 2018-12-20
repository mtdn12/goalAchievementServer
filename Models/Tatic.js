const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taticSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  strategy: {
    type: Schema.Types.ObjectId,
    ref: 'strategies',
  },
  goal: {
    type: Schema.Types.ObjectId,
    ref: 'goals',
    required: true,
  },
  objective: {
    type: Schema.Types.ObjectId,
    ref: 'objectives',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  timeEnd: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  timeInWeek: {
    type: Array,
    default: [],
    required: true,
  },
  totalAction: {
    type: Number,
    required: true,
  },
  completedAction: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('tatics', taticSchema)
