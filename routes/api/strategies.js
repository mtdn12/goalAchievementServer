const router = require('express').Router()

// imports middle ware
const authCheck = require('../../middlewares/checkAuthen')
// import Models
const Objective = require('../../Models/Objective')

const Strategy = require('../../Models/Strategy')

const Goal = require('../../Models/Goal')

const Tatic = require('../../Models/Tatic')

const Action = require('../../Models/Action')

// Import validation
const strategyInputValidation = require('../../validation/StrategyInput')
const strategyEditValidation = require('../../validation/strategyEdit')

// Post -Router
// des : Create new strategy and relate it to objective

router.post('/', authCheck, async (req, res) => {
  try {
    const { error } = strategyInputValidation(req.body)
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
      goal: objective.goal,
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

// Edit strategies
// Route: Put
router.put('/:id', authCheck, async (req, res) => {
  try {
    // Validate strategy input
    const { error } = strategyEditValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    // find and check that strategy
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!strategy) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found strategy match with that id',
      })
    }
    // update strategy
    strategy.name = req.body.name
    strategy.timeEnd = req.body.timeEnd
    strategy.description = req.body.description
    // save and return
    const saveStrategy = await strategy.save()
    if (!saveStrategy) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not save new strategy',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: saveStrategy,
      message: 'Edit strategy success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not delete that strategy',
    })
  }
})

// Get strategy detail
// Route: Get
router.get('/:id', authCheck, async (req, res) => {
  try {
    // Find that strategy and check
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).lean()
    if (!strategy) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any strategy match with that id',
      })
    }
    // find all tatics match with that strategies
    const tatics = await Tatic.find({
      strategy: req.params.id,
    }).lean()
    if (!tatics) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not found tatics match with that strategy',
      })
    }
    // match all tatics to strategy
    strategy.tatics = tatics
    // return
    return res.json({
      result: 'success',
      status: 200,
      item: strategy,
      message: 'Get strategy success',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get strategy detail',
    })
  }
})
// Delete strategy ana all tatics match with that strategy
// Route: delete
router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find that stratery
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!strategy) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any stratery match that id',
      })
    }
    // delete all Actions match that strategy
    const isDeleteAction = await Action.deleteMany({
      strategy: req.params.id,
    })
    if (!isDeleteAction) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete actions match with that strategy',
      })
    }
    // delete all tatics match that strategy
    const isDeleteTatic = await Tatic.deleteMany({
      strategy: req.params.id,
    })
    if (!isDeleteTatic) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete tatics match with that strategy',
      })
    }
    const isDeleteStrategy = await strategy.delete()
    if (!isDeleteStrategy) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete stratery',
      })
    }
    return res.json({
      status: 200,
      result: 'success',
      message: 'delete strategy success',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not delete strategy',
    })
  }
})

// export module

module.exports = router
