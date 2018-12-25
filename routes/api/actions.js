const router = require('express').Router()

// import model
const Action = require('../../Models/Action')
const Tatic = require('../../Models/Tatic')
const DailyTask = require('../../Models/DailyTask')

// import middleware
const authCheck = require('../../middlewares/checkAuthen')
// import validations
const actionInputValidation = require('../../validation/actionInput')
const actionEditValidation = require('../../validation/actionEdit')
// Post route
// Create new actions
router.post('/', authCheck, async (req, res) => {
  try {
    const { error } = actionInputValidation(req.body)
    if (error) {
      return res.json({
        status: 500,
        result: 'fail',
        error: error.details[0].message,
      })
    }
    // Check if have any tatic match that tatic id
    const tatic = await Tatic.findOne({
      user: req.user._id,
      _id: req.body.taticId,
    }).lean()
    if (!tatic) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any tatic match that taticId',
      })
    }
    const action = new Action({
      user: req.user._id,
      tatic: req.body.taticId,
      action: req.body.action,
      goal: tatic.goal,
      objective: tatic.objective,
      strategy: tatic.strategy,
    })
    const saveAction = await action.save()
    if (!saveAction) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'could not create new action',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      message: 'Create action success',
      item: saveAction,
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create action',
    })
  }
})

// Put route
// Edit actions
router.put('/:id', authCheck, async (req, res) => {
  try {
    const { error } = actionEditValidation(req.body)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    // Find action match that user and id
    const action = await Action.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    if (!action) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any action match that id',
      })
    }
    // change
    action.action = req.body.action
    // Save change to daily task too
    const task = await DailyTask.findOne({
      action: req.params.id,
    })
    if (task) {
      task.task = req.body.action
      const issaveDaily = await task.save()
      if (!issaveDaily) {
        return res.json({
          result: 'fail',
          status: 400,
          error: 'Could not save to daily task',
        })
      }
    }
    // Save action
    const saveAction = await action.save()
    if (!saveAction) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not save new action',
      })
    }
    // return result
    return res.json({
      result: 'success',
      status: 200,
      message: 'Edit action success',
      item: saveAction,
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'could not edit action',
    })
  }
})

// Get List action match with tatic id

router.get('/:id', authCheck, async (req, res) => {
  try {
    const actions = await Action.find({
      user: req.user._id,
      tatic: req.params.id,
    })
    if (!actions) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any action',
      })
    }
    // Return actions
    return res.json({
      result: 'success',
      status: 200,
      message: 'Get list actions success',
      items: actions,
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not find any action',
    })
  }
})

// Delete action
router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find that action match that id
    const action = await Action.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    if (!action) {
      return res.json({
        status: 404,
        result: 'fail',
        error: 'Could not found any action match that id',
      })
    }
    // Delete all daily task match with that action
    const isDeleteDaily = await DailyTask.deleteOne({
      action: req.params.id,
    })
    if (!isDeleteDaily) {
      return res.json({
        status: 500,
        result: 'fail',
        error: 'Could not delete Daily task match with that action',
      })
    }
    const isDeleteAction = await action.delete()
    if (!isDeleteAction) {
      return res.json({
        status: 500,
        result: 'fail',
        error: 'Could not delete action',
      })
    }
    return res.json({
      status: 200,
      result: 'success',
      message: 'Delete action success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not delte action',
    })
  }
})

module.exports = router
