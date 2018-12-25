const router = require('express').Router()

// Impot models
const Objective = require('../../Models/Objective')
const Goal = require('../../Models/Goal')
const Strategy = require('../../Models/Strategy')
const Tatic = require('../../Models/Tatic')
const Action = require('../../Models/Action')
// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Objective input validation
const objectiveInputValidation = require('../../validation/objectiveInput')
const objectiveEditValidation = require('../../validation/objectiveEdit')
// Helpers
const deleteActions = require('../../helpers/DeleteActions')
const reCount = require('../../helpers/updateCompleted')
// Post-router
// Create new objective

router.post('/', authCheck, async (req, res) => {
  try {
    const { error } = objectiveInputValidation(req.body)
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
    reCount.recountGoal(saveObj)
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

// Edit Objective
// put router

router.put('/:id', authCheck, async (req, res) => {
  try {
    const { error } = objectiveEditValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    // Find objective
    const objective = await Objective.findById(req.params.id)
    if (!objective) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any objecitve match that id',
      })
    }
    objective.name = req.body.name
    objective.timeEnd = req.body.timeEnd
    objective.description = req.body.description
    const saveObjective = await objective.save()
    if (!saveObjective) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not save edit objective',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: objective,
      message: 'Edit objective success',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not edit objective',
    })
  }
})

// get Objectives detail
// Get Router

router.get('/:id', authCheck, async (req, res) => {
  try {
    // Find that objective
    const objective = await Objective.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean()
    if (!objective) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found objective match with that id',
      })
    }
    // Find all strategies
    const strategies = await Strategy.find({
      goal: objective.goal,
      objective: objective._id,
    }).lean()
    if (!strategies) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not found strategies match with that objective',
      })
    }
    // find all tatics
    const tatics = await Tatic.find({
      goal: objective.goal,
    }).lean()
    if (!tatics) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not found tatics match with that objective',
      })
    }
    // match tatics to strategies
    if (tatics.length > 0) {
      tatics.forEach(tatic => {
        let strategy = strategies.find(stra => {
          return stra._id.toString() === tatic.strategy.toString()
        })
        if (strategy) {
          strategy.taticsDetail = strategy.taticsDetail
            ? strategy.taticsDetail
            : []
          strategy.taticsDetail.push(tatic)
        }
      })
    }
    // Match strategies to objective
    objective.strategies = strategies
    // return
    return res.json({
      result: 'success',
      status: 200,
      item: objective,
      message: 'Get objective detail success',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get objective detail',
    })
  }
})

// Delete Objective and all strategies and tatics match with it
// router detele
router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find that objective
    const objective = await Objective.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!objective) {
      return res.json({
        result: 'fail',
        status: 404,
        errror: 'Could not found objective match that id',
      })
    }
    // Delete all actions have this objective id

    const isDeleteAction = await Action.deleteMany({
      objective: objective._id,
    })
    const actions = await Action.find({
      objective: objective._id,
    })
    const isDeleteDaily = await deleteActions(actions)
    if (!isDeleteAction || !isDeleteDaily) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete actions match with that objective',
      })
    }
    // Delete all tatics have this objective id
    const isDeleteTatic = await Tatic.deleteMany({
      objective: objective._id,
    })
    if (!isDeleteTatic) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete tatics match with that objective',
      })
    }
    // Delete all strategies match with those strategies
    const isDeleteStrategy = await Strategy.deleteMany({
      objective: objective._id,
    })
    if (!isDeleteStrategy) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete strategies match with that objective',
      })
    }
    // Delete objectives
    const isDeleteObjective = await objective.delete()
    if (!isDeleteObjective) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete objective',
      })
    }
    // Return success
    return res.json({
      result: 'success',
      status: 200,
      message: 'Delete objective success',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not delete that objective',
    })
  }
})
module.exports = router
