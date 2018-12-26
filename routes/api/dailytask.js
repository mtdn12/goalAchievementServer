const router = require('express').Router()

// Import model
const DailyTask = require('../../Models/DailyTask')
const Tatic = require('../../Models/Tatic')

// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')
const timeout = require('connect-timeout')
// Helper
const reCount = require('../../helpers/updateCompleted')

// Get list dailytask
router.get('/', authCheck, async (req, res) => {
  try {
    const dailyTasks = await DailyTask.find({
      user: req.user._id,
    })
    if (!dailyTasks) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any daily task',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      items: dailyTasks,
      message: 'Get list daily task success',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get daily tasks',
    })
  }
})

// Check done an action
router.post('/check/:id', authCheck, async (req, res) => {
  req.setTimeout(0)
  try {
    // find task
    const task = await DailyTask.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!task) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any task',
      })
    }
    task.isDone = true
    // find tatic match that task and increase check done
    const tatic = await Tatic.findOne({
      _id: task.tatic,
      user: req.user._id,
    })
    if (!tatic) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any tatic match that task',
      })
    }
    tatic.completedAction = tatic.completedAction + 1
    // Save tatic and task
    const isSaveTask = await task.save()
    const isSaveTatic = await tatic.save()
    if (!isSaveTask || !isSaveTatic) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save your check',
      })
    }
    reCount.recountStrategy(isSaveTatic.strategy)
    return res.json({
      result: 'success',
      item: isSaveTask,
      status: 200,
      message: 'Check task success',
    })
    // done
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not check that task',
    })
  }
})

// Uncheck an action
router.post('/uncheck/:id', authCheck, async (req, res) => {
  req.setTimeout(0)
  try {
    // find task
    const task = await DailyTask.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!task) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any task',
      })
    }
    task.isDone = false
    // find tatic match that task and increase check done
    const tatic = await Tatic.findOne({
      _id: task.tatic,
      user: req.user._id,
    })
    if (!tatic) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any tatic match that task',
      })
    }
    tatic.completedAction = tatic.completedAction - 1
    // Save tatic and task
    const isSaveTask = await task.save()
    const isSaveTatic = await tatic.save()
    if (!isSaveTask || !isSaveTatic) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save your check',
      })
    }
    reCount.recountStrategy(isSaveTatic.strategy)
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveTask,
      message: ' unCheck task success',
    })
    // done
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not Uncheck that task',
    })
  }
})

module.exports = router
