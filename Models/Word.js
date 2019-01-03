/*
 model of word will include
  user: userId match with that word,
  createdAt: time create this word,
  timeRecall: number (how many time already recall this word),
  nextRecall: Time (time to next recall),(match with timeRecall : 0: 1day. 1: 3day, 2: 7day, 3: 1month, 4: 3month,                                           5: 6month, 6: 1year)
  isRecall: (true: recovering Today, false: not recovering Today)
  word: 'Name of word'
  Description: 'Description of the word'
  mapLink: 'Link to wordWeb of this word'
// How to count word every day
create a setinterval function will run everyday and it will check the next recall time
if(nextRecall > currentTime - 24h or nextRecall < currentTime + 24h) then set isRecall to true

*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const wordSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  timeRecall: {
    type: Number,
    default: 0,
  },
  nexRecall: {
    type: Date,
    default: Date.now() + 1000 * 60 * 60 * 24,
  },
  isRecall: {
    type: Boolean,
    default: false,
  },
  word: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  linkMap: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('words', wordSchema)
