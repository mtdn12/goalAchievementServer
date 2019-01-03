// import model
const Word = require('../Models/Word')

const countRecallWord = async user => {
  // Find all Word in list
  const words = await Word.find({
    user,
  })
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
