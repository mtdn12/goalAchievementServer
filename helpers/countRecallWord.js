// import model
const Word = require('../Models/Word')
// import helper
const nextRecallTime = require('./nextRecallTime')

const countRecallWord = async () => {
  // Find all words current recall
  const wordRecalls = await Word.find({
    isRecall: true,
  })
  const promises = []
  // All will be remove recallTime by 1 and update nextRecall match with current recall time
  if (wordRecalls && wordRecalls.length > 0) {
    wordRecalls.forEach(word => {
      word.timeRecall =
        word.timeRecall === 0 ? word.timeRecall : word.timeRecall - 1
      word.nexRecall = nextRecallTime(word.timeRecall)
      word.isRecall = false
      const promise = word.save()
      promises.push(promise)
    })
  }
  // Await all update and continue word like before
  await Promise.all(promises)
  // Find all Word in list
  const words = await Word.find()
  // Loop through all word and check if match the condition or not
  if (!words) return false
  let currentTime = Date.now()
  for (let i = 0; i < words.length; i++) {
    if (
      words[i].nexRecall > currentTime - 1000 * 60 * 60 * 24 ||
      words[i].nexRecall < currentTime + 1000 * 60 * 60 * 24
    ) {
      words[i].isRecall = true
      words[i].save()
    }
  }
  return true
}

module.exports = countRecallWord
