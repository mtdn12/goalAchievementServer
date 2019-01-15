const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DailyToDoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  todo: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('dailyTodos', DailyToDoSchema)
