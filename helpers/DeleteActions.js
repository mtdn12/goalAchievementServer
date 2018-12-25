// model
const DailyTask = require('../Models/DailyTask')

const deleteActions = async actions => {
  try {
    const promises = []
    // Loopthrough all actions
    for (let i = 0; i < actions.length; i++) {
      const promise = DailyTask.deleteOne({
        action: actions[i]._id,
      }).exec()
      promises.push(promise)
    }
    const isDelete = await Promise.all(promises)
    return isDelete
  } catch (error) {
    return null
  }
}

module.exports = deleteActions
