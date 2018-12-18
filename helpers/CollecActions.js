// import model
const Tatic = require('../Models/Tatic')
const Action = require('../Models/Action')
const History = require('../Models/History')
const DailyTask = require('../Models/DailyTask')

async function CollectActions() {
  // Find and tatics
  const tatics = await Tatic.find()
  if (!tatics) {
    return
  }
  let date = new Date()
  // filter tatic have time in week same as today
  const todayTatics = tatics.filter(tatic =>
    tatic.timeInWeek.includes(date.getDay())
  )
  // loop for all tatic and find all action match with them
  const promises = []
  todayTatics.forEach(tatic => {
    let promise = Action.find({
      tatic: tatic._id,
    }).exec()
    promises.push(promise)
  })
  const actionList = await Promise.all(promises)
  // Query all dailyTask and push them to History
  const dailyTasks = await DailyTask.find()
  dailyTasks.forEach(task => {
    const history = new History({
      user: task.user,
      tatic: task.tatic,
      action: task.action,
      timeAction: task.createdAt,
      isDone: task.isDone,
    })
    history.save()
  })
  // delete Add new action to daily tasks
  await DailyTask.deleteMany()
  actionList.forEach(actions => {
    actions.forEach(ac => {
      const dailyTask = new DailyTask({
        user: ac.user,
        tatic: ac.tatic,
        action: ac.action,
      })
      dailyTask.save()
    })
  })
}

module.exports = CollectActions
