const mongoose = require('mongoose')
const Schema = mongoose.Schema

const strategySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  objective: {
    type: Schema.Types.ObjectId,
    ref: 'objectives',
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  timeEnd: {
    type: Date,
    required: true,
  },
  tatics: [
    {
      strategy: {
        type: Schema.Types.ObjectId,
        ref: 'tatics',
      },
    },
  ],
  description: {
    type: String,
  },
  perCent: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('strategies', strategySchema)
