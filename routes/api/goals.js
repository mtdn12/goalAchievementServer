/* eslint-disable no-inner-declarations */
const router = require('express').Router()
// Goals Modules
const Goal = require('../../Models/Goal')
const Objective = require('../../Models/Objective')
const Strategy = require('../../Models/Strategy')
const Tatic = require('../../Models/Tatic')
// Validate goal input
const goalsInputValidation = require('../../validation/goalInput')
// Middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Post route
// Create new post
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
      description: req.body.description,
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

// Put route
// Edit goal
router.put('/:id', authCheck, async (req, res) => {
  try {
    const { error, value } = goalsInputValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        error: error.details[0].message,
        status: 400,
      })
    }
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!goal) {
      return res.json({
        result: 'fail',
        error: 'Could not find goal match that id',
        status: 404,
      })
    }
    goal.name = req.body.name
    goal.description = req.body.description
    goal.timeEnd = req.body.timeEnd
    const saveGoal = await goal.save()
    if (!saveGoal) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not save new goal',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: saveGoal,
      message: 'Edit goal success',
    })
  } catch (error) {
    res.json({
      result: 'fail',
      status: 400,
      error: 'Could not edit goal',
    })
  }
})

// Get list Goal match with user

router.get('/', authCheck, async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user._id,
    }).populate('user')
    if (!goals) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any goals',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      items: goals,
      message: 'Get list goal success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not list goal',
    })
  }
})

// Get detail Goal
router.get('/:id', authCheck, async (req, res) => {
  try {
    // Find goal match id and user
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('user')
      .lean()
    if (!goal) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found that goal',
      })
    }
    // find all objectives match that goal id
    const objectives = await Objective.find({
      goal: req.params.id,
      user: req.user._id,
    }).lean()
    if (!objectives) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found Objectives match with that goal',
      })
    }
    // Find all strategies match that goal id
    const strategies = await Strategy.find({
      goal: req.params.id,
      user: req.user._id,
    }).lean()
    if (!strategies) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found Strategies match with that goal',
      })
    }
    // find all tatics match that goal id
    const tatics = await Tatic.find({
      goal: req.params.id,
      user: req.user._id,
    })
    if (!tatics) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found tatics match with that goal',
      })
    }
    // match all tatics to strategies
    tatics.forEach(tatic => {
      let strategy = strategies.find(stra => {
        return stra._id.toString() === tatic.strategy.toString()
      })
      strategy.taticsDetail = strategy.taticsDetail ? strategy.taticsDetail : []
      strategy.taticsDetail.push(tatic)
    })
    // match all strategies to objectives
    strategies.forEach(strategy => {
      let objective = objectives.find(
        obj => obj._id.toString() === strategy.objective.toString()
      )
      objective.strategiesDetail = objective.strategiesDetail
        ? objective.strategiesDetail
        : []
      objective.strategiesDetail.push(strategy)
    })
    // match objectives to goal
    goal.objectives = objectives
    // Get all tatics
    // Test send
    res.json({
      result: 'success',
      item: goal,
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get goal detail',
    })
  }
})

// Delete Goal

router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find that goal
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!goal) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found that goal ',
      })
    }
    // Delete all tatics match with that goal
    const isRemoveTatic = await Tatic.deleteMany({
      goal: req.params.id,
    })
    if (!isRemoveTatic) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete tatics match with that goals',
      })
    }
    // Delete all strategies match with that goal
    const isRemoveStrategy = await Strategy.deleteMany({
      goal: req.params.id,
    })
    if (!isRemoveStrategy) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete strategies match with that goals',
      })
    }
    // Delete all objectives match with that goal
    const isRemoveObjective = await Objective.deleteMany({
      goal: req.params.id,
    })
    if (!isRemoveObjective) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete Objectives match with that goals',
      })
    }
    // Delete goal
    const isRemoveGoal = goal.delete()
    if (!isRemoveGoal) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete goal',
      })
    }
    // success
    return res.json({
      result: 'success',
      status: 200,
      message: 'Delete goal success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not delete that goal',
    })
  }
})

module.exports = router
