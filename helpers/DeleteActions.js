// model
const DailyTask = require('../Models/DailyTask')

const deleteActions = async action => {
  try {
    console.log(action)
    const isDelete = await DailyTask.deleteOne({
      action: action._id,
    }).exec()
    console.log(isDelete)
    return isDelete
  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = deleteActions
