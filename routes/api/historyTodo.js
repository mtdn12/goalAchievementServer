const router = require('express').Router()

// Import Model
const TodoHistory = require('../../Models/ToDoHistory')

// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Router get History todo
router.get('/', authCheck, async (req, res) => {
  try {
    const page = +req.query.page - 1 || 0
    const limit = +req.query.limit || 100
    const totalCount = await TodoHistory.count()
    const todos = await TodoHistory.find({
      user: req.user._id,
    })
      .skip(page * limit)
      .limit(limit)
      .sort('-date')
    if (!todos) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any History',
      })
    }
    const totalPages = Math.ceil(totalCount / limit)
    return res.json({
      result: 'success',
      status: 200,
      items: todos,
      totalPages,
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
