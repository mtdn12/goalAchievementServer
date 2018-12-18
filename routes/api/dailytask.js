const router = require('express').Router()

// Import model
const DailyTask = require('../../Models/DailyTask')

// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Get list dailytask
router.get('/', authCheck, async (req, res) => {
  try {
    const dailyTasks = DailyTask.find({
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
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get daily tasks',
    })
  }
})

// Check done an action
router.post('check/:id', authCheck, async (req, res) => {
  try {
    // find task
    // find tatic match that task and increase check done
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
router.post('uncheck/:id', authCheck, async (req, res) => {
  try {
    // find task
    // find tatic match that task and decrease check done
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
