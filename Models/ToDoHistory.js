const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  percent: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  details: [
    {
      todo: {
        type: String,
      },
      isComplete: {
        type: Boolean,
      },
    },
  ],
})

module.exports = mongoose.model('todoHistories', TodoHistorySchema)
