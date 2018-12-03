const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GoalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  objectives: [
    {
      objective: {
        type: Schema.Types.ObjectId,
        ref: 'objectives',
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
    default: 0,
    type: Number,
  },
})

module.exports = mongoose.model('goals', GoalSchema)
