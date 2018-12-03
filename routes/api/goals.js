const router = require('express').Router()

// Goals Modules
const Goal = require('../../Models/Goal')
// Validate goal input
const goalsInputValidation = require('../../validation/goalInput')
// Middlewares
const authCheck = require('../../middlewares/checkAuthen')

router.post('/', authCheck, async (req, res) => {
  try {
    const { error, value } = goalsInputValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    const newGoal = new Goal({
      user: req.user._id,
      name: req.body.name,
      timeEnd: req.body.timeEnd,
    })
    const goal = await newGoal.save()
    if (!goal) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not create new Goal',
      })
    } else {
      return res.json({
        result: 'success',
        status: 200,
        message: 'Create new goal success',
        item: goal,
      })
    }
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create new Goal',
    })
  }
})

module.exports = router
