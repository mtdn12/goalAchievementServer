const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DiarySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  content: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('diaries', DiarySchema)
