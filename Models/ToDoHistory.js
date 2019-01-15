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
  Date: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('todoHistories', TodoHistorySchema)
