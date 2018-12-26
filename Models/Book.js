const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  review: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('books', bookSchema)
