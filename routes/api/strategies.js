const router = require('express').Router()

// imports middle ware
const authCheck = require('../../middlewares/checkAuthen')
// import Models
const Objective = require('../../Models/Objective')

const Strategy = require('../../Models/Strategy')

// Import validation
const strategyInputValidation = require('../../validation/StrategyInput')

// Post -Router
// des : Create new strategy and relate it to objective

router.post('/', authCheck, async (req, res) => {
  try {
    const { error, value } = strategyInputValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    const objective = await Objective.findOne({
      _id: req.body.objectiveId,
      user: req.user._id,
    })
    if (!objective) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not find any objective match that objective Id',
      })
    }
    // Create new Strategy
    const newStrategy = new Strategy({
      name: req.body.name,
      description: req.body.description,
      timeEnd: req.body.timeEnd,
      objective: objective._id,
      user: req.user._id,
    })
    const saveStrategy = await newStrategy.save()
    if (!saveStrategy) {
      return res.json({
        status: 400,
        result: 'fail',
        error: 'Could not create new strategy',
      })
    }
    // Add strategy to objective
    objective.strategies.push(saveStrategy._id)
    const saveObjective = await objective.save()
    if (!saveObjective) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not Save strategy to objective',
      })
    }
    // return
    return res.json({
      result: 'success',
      status: 200,
      message: 'Create Strategy success',
      item: saveStrategy,
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create new Strategy',
    })
  }
})

// export module

module.exports = router
