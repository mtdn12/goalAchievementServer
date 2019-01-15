const router = require('express').Router()

// Import Model
const TodoHistory = require('../../Models/ToDoHistory')

// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Router get History todo
router.get('/', authCheck, async (req, res) => {
  try {
    const todos = await TodoHistory.find({
      user: req.user._id,
    })
    if (!todos) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any History',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      items: todos,
      message: 'Get list history success ',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get list history',
    })
  }
})

module.exports = router
