const router = require('express').Router()

// Impot models
const Objective = require('../../Models/Objective')
const Goal = require('../../Models/Goal')
// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Objective input validation
const objectiveInputValidation = require('../../validation/objectiveInput')

// Post-router
// Create new objective

router.post('/', authCheck, async (req, res) => {
  try {
    const { error, value } = objectiveInputValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    // Check goal exist or not
    const goal = await Goal.findOne({
      _id: req.body.goalId,
      user: req.user._id,
    })
    console.log(goal)
    if (!goal) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found that goal with that goal ID',
      })
    }
    // Create new Objective
    const newObjective = new Objective({
      name: req.body.name,
      description: req.body.description,
      timeEnd: req.body.timeEnd,
      goal: req.body.goalId,
      user: req.user._id,
    })
    // Save objective
    const saveObj = await newObjective.save()
    // Add this objective to goals
    if (!saveObj) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not create new Objective',
      })
    }
    goal.objectives.push(saveObj._id)
    let newGoal = await goal.save()
    if (!newGoal) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not save new Objective to goal',
      })
    }
    // Return
    return res.json({
      result: 'success',
      status: 200,
      message: 'Create objective success',
      item: saveObj,
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create new Objective',
    })
  }
})

module.exports = router
