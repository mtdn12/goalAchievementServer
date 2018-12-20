const router = require('express').Router()

// Import model
const History = require('../../Models/History')
// import middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Get router
router.get('/:id', authCheck, async (req, res) => {
  try {
    const histories = await History.find({
      user: req.user._id,
      tatic: req.params.id,
    })
    if (!histories) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any history',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      items: histories,
      message: 'Get list history success',
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
