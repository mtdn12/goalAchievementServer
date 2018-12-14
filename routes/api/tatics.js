const router = require('express').Router()
// Import models

const Tatic = require('../../Models/Tatic')
const Strategy = require('../../Models/Strategy')
const Goal = require('../../Models/Goal')

// Import middle wares
const authCheck = require('../../middlewares/checkAuthen')

// Import validations
const inputTaticValidation = require('../../validation/taticInput')
const editTaticValidation = require('../../validation/taticEdit')

// Post router
// Create new tatic
router.post('/', authCheck, async (req, res) => {
  try {
    const { error, value } = inputTaticValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    // find That strategy exist or not
    const strategy = await Strategy.findOne({
      _id: req.body.strategyId,
      user: req.user._id,
    })
    if (!strategy) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any strategy match that strategy Id',
      })
    }
    const goal = await Goal.findOne({
      _id: req.body.goalId,
      user: req.user._id,
    })
    if (!goal) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any Goal match that goal id',
      })
    }
    // Create new tatic object
    const totalCount =
      Math.ceil(
        (Date.parse(req.body.timeEnd) - Date.now()) / 1000 / 60 / 60 / 24 / 7
      ) * req.body.timeInWeek.length
    const newTatic = new Tatic({
      name: req.body.name,
      user: req.user._id,
      strategy: req.body.strategyId,
      totalAction: totalCount,
      description: req.body.description,
      timeEnd: req.body.timeEnd,
      timeInWeek: req.body.timeInWeek,
      goal: goal._id,
    })
    const saveTatic = await newTatic.save()
    if (!newTatic) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not create new tatic',
      })
    }
    // add tatic to strategy
    strategy.tatics.push(saveTatic._id)
    const saveStrategy = strategy.save()
    if (!saveStrategy) {
      return res.json({
        result: 'Fail',
        status: 400,
        error: 'Could not save tatic to strategy',
      })
    }
    // return
    res.json({
      result: 'Success',
      status: 200,
      item: saveTatic,
      message: 'Create new tatic success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create new tatic',
    })
  }
})

// Edit tatic
// Route put
router.put('/:id', authCheck, async (req, res) => {
  try {
    // validate tatic
    const { error, value } = editTaticValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    const tatic = await Tatic.find({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!tatic) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any tatic match with that id',
      })
    }
    // add new values
    const totalCount =
      Math.ceil(
        (Date.parse(req.body.timeEnd) - tatic.createdAt) /
          1000 /
          60 /
          60 /
          24 /
          7
      ) * req.body.timeInWeek.length
    tatic.name = req.body.name
    tatic.description = req.body.description
    tatic.timeEnd = req.body.timeEnd
    tatic.timeInWeek = req.body.timeInWeek
    tatic.totalCount = totalCount
    const saveTatic = await tatic.save()
    if (!saveTatic) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not save new tatic',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: saveTatic,
      message: 'Edit tatic success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not edit that tatic',
    })
  }
})

// Get tatic detail
// Route : get
router.get('/:id', authCheck, async (req, res) => {
  try {
    // find that tatic
    const tatic = await Tatic.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!tatic) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any tatic match that id',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: tatic,
      message: 'Get tatic detail success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get tatic detail',
    })
  }
})

// Delete tatic
// Route Delete
router.delete('/:id', authCheck, async (req, res) => {
  try {
    // find that tatic
    const tatic = await Tatic.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!tatic) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any tatic match that id',
      })
    }
    const isDeleteTatic = tatic.delete()
    if (!isDeleteTatic) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete tatic',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      message: 'delete tatic success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      erro: 'Could not delete tatic',
    })
  }
})

// Export module

module.exports = router
