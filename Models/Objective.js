const mongoose = require('mongoose')
const Schema = mongoose.Schema

const objectiveSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  goal: {
    type: Schema.Types.ObjectId,
    ref: 'goals',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  strategies: [
    {
      tatic: {
        type: Schema.Types.ObjectId,
        ref: 'strategies',
      },
    },
  ],
  timeEnd: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  perCent: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('objectives', objectiveSchema)
